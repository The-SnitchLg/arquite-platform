import { 
  UserProfile, 
  JourneyData, 
  DiamondVersion, 
  ProfDiamondVersion,
  ContextKey, 
  Dimension, 
  ThresholdStatus, 
  InterventionKind, 
  AuditEvent,
  ModuleClosure,
  ReplacementConsent,
  ThresholdRecord,
  InterventionRecord,
  LetterRecord
} from '../types/domain';
import { 
  ADMIN_USER, 
  DEMO_PARTICIPANT, 
  createEmptyJourney, 
  createSampleJourneyForAdminDemo 
} from './seed';
import { 
  calculateDiamondProgress, 
  calculateProfDiamondProgress,
  calculateThresholdsProgress, 
  calculateLettersProgress 
} from '../domain/completeness';
import { createInitialThresholds, createInitialInterventions } from '../domain/constants';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_USER = 'arquite_current_user';
const STORAGE_KEY_JOURNEYS = 'arquite_journeys_v1';
const STORAGE_KEY_AUDIT = 'arquite_audit_v1';
const STORAGE_KEY_CONSENTS = 'arquite_consents_v1';

// Helper for debouncing remote calls
function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number): T {
  let timeoutId: any;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  }) as T;
}

class DataRepository {
  private currentUser: UserProfile | null = null;
  private journeys: Map<string, JourneyData> = new Map();
  private auditEvents: AuditEvent[] = [];
  private replacementConsents: ReplacementConsent[] = [];
  private listeners: Set<() => void> = new Set();
  private isInitializing: boolean = true;

  constructor() {
    this.initLocal();
    this.initSupabase();
  }

  // 1. Inmediata inicialización local para respuesta instantánea (0ms)
  private initLocal() {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch {
      this.currentUser = null;
    }

    try {
      const savedJourneys = localStorage.getItem(STORAGE_KEY_JOURNEYS);
      if (savedJourneys) {
        const parsed: JourneyData[] = JSON.parse(savedJourneys);
        parsed.forEach(j => this.journeys.set(j.ownerId, j));
      }
    } catch {}

    // Fallback de demostración
    if (!this.journeys.has(DEMO_PARTICIPANT.id)) {
      const sample = createSampleJourneyForAdminDemo();
      this.journeys.set(sample.ownerId, sample);
    }

    try {
      const savedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (savedAudit) {
        this.auditEvents = JSON.parse(savedAudit);
      }
    } catch {}

    try {
      const savedConsents = localStorage.getItem(STORAGE_KEY_CONSENTS);
      if (savedConsents) {
        this.replacementConsents = JSON.parse(savedConsents);
      }
    } catch {}
  }

  // 2. Sincronización asíncrona con Supabase Auth y PostgreSQL
  private async initSupabase() {
    if (!isSupabaseConfigured) {
      this.isInitializing = false;
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await this.loadUserProfileAndJourney(session.user.id, session.user.email || '');
      }

      // Escuchar cambios de sesión
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.loadUserProfileAndJourney(session.user.id, session.user.email || '');
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          localStorage.removeItem(STORAGE_KEY_USER);
          this.notify();
        }
      });
    } catch (err) {
      console.warn('[Supabase] Init sync warning:', err);
    } finally {
      this.isInitializing = false;
    }
  }

  public isReady(): boolean {
    return !this.isInitializing;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private persistLocal() {
    try {
      const list = Array.from(this.journeys.values());
      localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(list));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      }
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditEvents));
      localStorage.setItem(STORAGE_KEY_CONSENTS, JSON.stringify(this.replacementConsents));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
    this.notify();
  }

  // Carga completa del perfil y recorrido desde Supabase
  public async loadUserProfileAndJourney(userId: string, email: string): Promise<void> {
    try {
      // 1. Obtener perfil
      const { data: profileData, error: profileErr } = await supabase
        .from('arq_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) throw profileErr;

      let userProfile: UserProfile;
      if (profileData) {
        userProfile = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          createdAt: profileData.created_at
        };
      } else {
        // Fallback perfil provisional
        userProfile = {
          id: userId,
          email: email.toLowerCase(),
          name: email.split('@')[0],
          role: email.toLowerCase() === 'larrygomezg@gmail.com' ? 'admin' : 'participant',
          createdAt: new Date().toISOString()
        };
      }

      this.currentUser = userProfile;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));

      // 2. Obtener recorrido
      const { data: journeyData, error: journeyErr } = await supabase
        .from('arq_journeys')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();

      if (journeyErr) throw journeyErr;

      let journey: JourneyData;
      if (journeyData) {
        // Cargar módulos vinculados
        journey = await this.assembleJourneyFromDatabase(journeyData, userProfile);
      } else {
        // Crear recorrido vacío
        journey = createEmptyJourney(userProfile);
      }

      this.journeys.set(userProfile.id, journey);
      this.persistLocal();

      // Si es admin, cargar datos administrativos
      if (userProfile.role === 'admin') {
        await this.loadAdminData();
      }
    } catch (err) {
      console.error('[Supabase] Error loading user profile & journey:', err);
    }
  }

  // Ensambla el JourneyData a partir de las tablas normalizadas de Supabase
  private async assembleJourneyFromDatabase(jRow: any, user: UserProfile): Promise<JourneyData> {
    const journeyId = jRow.id;

    // 1. Diamond Versions
    const { data: versions } = await supabase
      .from('arq_diamond_versions')
      .select('*')
      .eq('journey_id', journeyId)
      .order('version_number', { ascending: true });

    let slotA: DiamondVersion | null = null;
    let slotB: DiamondVersion | null = null;

    if (versions && versions.length > 0) {
      for (const vRow of versions) {
        // Cargar contextos
        const { data: contextsData } = await supabase
          .from('arq_diamond_contexts')
          .select('context_key, body')
          .eq('version_id', vRow.id);

        const contexts: Record<ContextKey, string> = { entorno: '', talentos: '', posibilidades: '' };
        if (contextsData) {
          contextsData.forEach((c: any) => {
            if (c.context_key in contexts) {
              contexts[c.context_key as ContextKey] = c.body || '';
            }
          });
        }

        // Cargar respuestas
        const { data: answersData } = await supabase
          .from('arq_diamond_answers')
          .select('dimension, decision_index, body')
          .eq('version_id', vRow.id);

        const personalAnswers = ['', '', '', '', ''];
        const professionalAnswers = ['', '', '', '', ''];

        if (answersData) {
          answersData.forEach((a: any) => {
            if (a.dimension === 'personal' && a.decision_index >= 0 && a.decision_index < 5) {
              personalAnswers[a.decision_index] = a.body || '';
            } else if (a.dimension === 'profesional' && a.decision_index >= 0 && a.decision_index < 5) {
              professionalAnswers[a.decision_index] = a.body || '';
            }
          });
        }

        const assembledVersion: DiamondVersion = {
          id: vRow.id,
          journeyId: vRow.journey_id,
          versionNumber: vRow.version_number,
          slot: vRow.slot,
          status: vRow.status,
          startedAt: vRow.started_at,
          closedAt: vRow.closed_at || undefined,
          confirmedBy: vRow.confirmed_by || undefined,
          contexts,
          personalAnswers,
          professionalAnswers,
          revision: Number(vRow.revision || 1)
        };

        if (vRow.slot === 'A') slotA = assembledVersion;
        if (vRow.slot === 'B') slotB = assembledVersion;
      }
    }

    // 1b. Professional Diamond Versions
    const { data: profVersions } = await supabase
      .from('arq_prof_diamond_versions')
      .select('*')
      .eq('journey_id', journeyId)
      .order('version_number', { ascending: true });

    let profSlotA: ProfDiamondVersion | null = null;
    let profSlotB: ProfDiamondVersion | null = null;

    if (profVersions && profVersions.length > 0) {
      for (const pvRow of profVersions) {
        const { data: contextsData } = await supabase
          .from('arq_prof_diamond_contexts')
          .select('context_key, body')
          .eq('version_id', pvRow.id);

        const contexts: Record<ContextKey, string> = { entorno: '', talentos: '', posibilidades: '' };
        if (contextsData) {
          contextsData.forEach((c: any) => {
            if (c.context_key in contexts) {
              contexts[c.context_key as ContextKey] = c.body || '';
            }
          });
        }

        const { data: answersData } = await supabase
          .from('arq_prof_diamond_answers')
          .select('decision_index, body')
          .eq('version_id', pvRow.id);

        const professionalAnswers = ['', '', '', '', ''];
        if (answersData) {
          answersData.forEach((a: any) => {
            if (a.decision_index >= 0 && a.decision_index < 5) {
              professionalAnswers[a.decision_index] = a.body || '';
            }
          });
        }

        const assembledPv: ProfDiamondVersion = {
          id: pvRow.id,
          journeyId: pvRow.journey_id,
          versionNumber: pvRow.version_number,
          slot: pvRow.slot,
          status: pvRow.status,
          startedAt: pvRow.started_at,
          closedAt: pvRow.closed_at || undefined,
          confirmedBy: pvRow.confirmed_by || undefined,
          contexts,
          professionalAnswers,
          revision: Number(pvRow.revision || 1)
        };

        if (pvRow.slot === 'A') profSlotA = assembledPv;
        if (pvRow.slot === 'B') profSlotB = assembledPv;
      }
    }

    // 2. Thresholds
    const { data: thRows } = await supabase
      .from('arq_threshold_records')
      .select('*')
      .eq('journey_id', journeyId);

    const initialTh = createInitialThresholds();
    const thresholds: ThresholdRecord[] = initialTh.map(def => {
      const found = thRows?.find((r: any) => r.threshold_key === def.key);
      if (found) {
        return {
          ...def,
          status: found.status,
          reflection: found.reflection || '',
          evidence: found.evidence || '',
          updatedAt: found.updated_at
        };
      }
      return def;
    });

    // 3. Interventions
    const { data: intRows } = await supabase
      .from('arq_interventions')
      .select('*')
      .eq('journey_id', journeyId);

    const initialInt = createInitialInterventions();
    const interventions: InterventionRecord[] = initialInt.map(def => {
      const found = intRows?.find((r: any) => r.intervention_key === def.key);
      if (found) {
        return {
          ...def,
          kind: found.kind || def.kind,
          actionText: found.action_text || '',
          evidenceText: found.evidence_text || '',
          updatedAt: found.updated_at
        };
      }
      return def;
    });

    // 4. Letters
    const { data: letRows } = await supabase
      .from('arq_letters')
      .select('*')
      .eq('journey_id', journeyId);

    const letters: Record<Dimension, LetterRecord> = {
      personal: {
        dimension: 'personal',
        body: letRows?.find((l: any) => l.dimension === 'personal')?.body || '',
        updatedAt: letRows?.find((l: any) => l.dimension === 'personal')?.updated_at || new Date().toISOString(),
        isSealed: Boolean(letRows?.find((l: any) => l.dimension === 'personal')?.is_sealed),
        sealedAt: letRows?.find((l: any) => l.dimension === 'personal')?.sealed_at || undefined
      },
      profesional: {
        dimension: 'profesional',
        body: letRows?.find((l: any) => l.dimension === 'profesional')?.body || '',
        updatedAt: letRows?.find((l: any) => l.dimension === 'profesional')?.updated_at || new Date().toISOString(),
        isSealed: Boolean(letRows?.find((l: any) => l.dimension === 'profesional')?.is_sealed),
        sealedAt: letRows?.find((l: any) => l.dimension === 'profesional')?.sealed_at || undefined
      }
    };

    // 5. Module Closures
    const { data: clsRows } = await supabase
      .from('arq_module_closures')
      .select('*')
      .eq('journey_id', journeyId);

    const closures: ModuleClosure[] = (clsRows || []).map((c: any) => ({
      id: c.id,
      journeyId: c.journey_id,
      module: c.module,
      editionNo: c.edition_no,
      diamondVersionId: c.diamond_version_id || undefined,
      closedAt: c.closed_at,
      confirmedBy: c.confirmed_by,
      snapshot: c.snapshot,
      snapshotHash: c.snapshot_hash
    }));

    if (!profSlotA) {
      profSlotA = {
        id: `dia-pro-${user.id}-v1`,
        journeyId,
        versionNumber: 1,
        slot: 'A',
        status: 'draft',
        startedAt: new Date().toISOString(),
        contexts: { entorno: '', talentos: '', posibilidades: '' },
        professionalAnswers: ['', '', '', '', ''],
        revision: 1
      };
    }

    return {
      id: journeyId,
      ownerId: user.id,
      ownerEmail: user.email,
      ownerName: user.name,
      createdAt: jRow.created_at,
      updatedAt: jRow.updated_at,
      diamondSlotA: slotA,
      diamondSlotB: slotB,
      profDiamondSlotA: profSlotA,
      profDiamondSlotB: profSlotB,
      thresholds,
      interventions,
      letters,
      closures
    };
  }

  // --- Auth API ---

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public async login(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Demo participant shortcut for presentations and automated report verification
    if (cleanEmail === 'director@estudioarquite.com' || cleanEmail === 'participante@arquite.com') {
      this.currentUser = DEMO_PARTICIPANT;
      const sample = createSampleJourneyForAdminDemo();
      this.journeys.set(sample.ownerId, sample);
      this.persistLocal();
      this.logAudit('PARTICIPANT_LOGIN', 'auth', DEMO_PARTICIPANT.id, 'Acceso de participante demo');
      return { success: true };
    }

    // 1. Supabase Auth directo
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass
        });

        if (error) {
          // Si es credenciales incorrectas
          return { success: false, error: 'Credenciales inválidas. Verifica tu correo y contraseña.' };
        }

        if (data.user) {
          await this.loadUserProfileAndJourney(data.user.id, data.user.email || cleanEmail);
          this.logAudit('USER_LOGIN', 'auth', data.user.id, `Inicio de sesión exitoso: ${cleanEmail}`);
          return { success: true };
        }
      } catch (err: any) {
        console.error('[Supabase Auth] Login error:', err);
        return { success: false, error: err?.message || 'Error de conexión con el servicio de autenticación.' };
      }
    }

    // Fallback local en caso de que no haya conexión
    if (cleanEmail === 'larrygomezg@gmail.com' && pass === 'barbara123') {
      this.currentUser = ADMIN_USER;
      this.persistLocal();
      return { success: true };
    }

    return { success: false, error: 'Credenciales inválidas.' };
  }

  public async register(name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanName || pass.length < 6) {
      return { success: false, error: 'Por favor completa todos los campos requeridos (mínimo 6 caracteres de contraseña).' };
    }

    if (cleanEmail === 'larrygomezg@gmail.com') {
      return { success: false, error: 'Esta cuenta ya está reservada para administración. Usa la pantalla de acceso directivo.' };
    }

    // 1. Supabase Auth directo
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: {
            data: { full_name: cleanName }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // El trigger on_auth_user_created en Postgres aprovisiona automáticamente:
          // 1. arq_profiles
          // 2. arq_journeys
          // 3. arq_diamond_versions (v1 Slot A draft)
          // 4. arq_threshold_records (U01..U07)
          // 5. arq_letters (personal, profesional)
          await this.loadUserProfileAndJourney(data.user.id, cleanEmail);
          this.logAudit('USER_REGISTER', 'user', data.user.id, `Registro exitoso en Supabase: ${cleanEmail}`);
          return { success: true };
        }
      } catch (err: any) {
        console.error('[Supabase Auth] Register error:', err);
        return { success: false, error: err?.message || 'Error de conexión al registrar cuenta.' };
      }
    }

    // Fallback local
    const id = 'usr-' + Date.now().toString(36);
    const newUser: UserProfile = {
      id,
      email: cleanEmail,
      name: cleanName,
      role: 'participant',
      createdAt: new Date().toISOString()
    };
    this.currentUser = newUser;
    const newJourney = createEmptyJourney(newUser);
    this.journeys.set(newUser.id, newJourney);
    this.persistLocal();
    return { success: true };
  }

  public async logout(): Promise<void> {
    if (this.currentUser) {
      this.logAudit('LOGOUT', 'auth', this.currentUser.id, 'Cierre de sesión voluntario');
    }
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    this.notify();
  }

  // --- Journey API ---

  public getJourney(userId?: string): JourneyData | null {
    const targetId = userId || this.currentUser?.id;
    if (!targetId) return null;
    let journey = this.journeys.get(targetId);
    if (!journey && this.currentUser && this.currentUser.id === targetId) {
      journey = createEmptyJourney(this.currentUser);
      this.journeys.set(targetId, journey);
      this.persistLocal();
    }
    return journey || null;
  }

  // --- Diamond API ---

  public saveDiamondContext(slot: 'A' | 'B', key: ContextKey, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return false;

    const targetVersion = slot === 'A' ? journey.diamondSlotA : journey.diamondSlotB;
    if (!targetVersion || targetVersion.status === 'closed') return false;

    const updatedVersion: DiamondVersion = {
      ...targetVersion,
      contexts: {
        ...targetVersion.contexts,
        [key]: value
      },
      revision: targetVersion.revision + 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      diamondSlotA: slot === 'A' ? updatedVersion : journey.diamondSlotA,
      diamondSlotB: slot === 'B' ? updatedVersion : journey.diamondSlotB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    // Debounced remote persist to Supabase
    this.debouncedSaveDiamondContext(targetVersion.id, key, value);
    return true;
  }

  private debouncedSaveDiamondContext = debounce(async (versionId: string, key: ContextKey, value: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_diamond_contexts').upsert({
        version_id: versionId,
        context_key: key,
        body: value,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving diamond context:', err);
    }
  }, 400);

  public saveDiamondChoice(slot: 'A' | 'B', dimension: Dimension, index: number, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return false;

    const targetVersion = slot === 'A' ? journey.diamondSlotA : journey.diamondSlotB;
    if (!targetVersion || targetVersion.status === 'closed') return false;

    const newPersonal = [...targetVersion.personalAnswers];
    const newProfessional = [...targetVersion.professionalAnswers];

    if (dimension === 'personal') {
      newPersonal[index] = value;
    } else {
      newProfessional[index] = value;
    }

    const updatedVersion: DiamondVersion = {
      ...targetVersion,
      personalAnswers: newPersonal,
      professionalAnswers: newProfessional,
      revision: targetVersion.revision + 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      diamondSlotA: slot === 'A' ? updatedVersion : journey.diamondSlotA,
      diamondSlotB: slot === 'B' ? updatedVersion : journey.diamondSlotB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    // Debounced remote persist to Supabase
    this.debouncedSaveDiamondChoice(targetVersion.id, dimension, index, value);
    return true;
  }

  private debouncedSaveDiamondChoice = debounce(async (versionId: string, dimension: Dimension, index: number, value: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_diamond_answers').upsert({
        version_id: versionId,
        dimension,
        decision_index: index,
        body: value,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving diamond choice:', err);
    }
  }, 400);

  public closeDiamond(slot: 'A' | 'B'): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    const version = slot === 'A' ? journey.diamondSlotA : journey.diamondSlotB;
    if (!version) return { success: false, error: 'Versión inexistente.' };
    if (version.status === 'closed') return { success: false, error: 'Esta versión ya fue confirmada y cerrada.' };

    const progress = calculateDiamondProgress(version);
    if (!progress.readyToClose) {
      return { 
        success: false, 
        error: `Requisitos incompletos (${progress.totalUnits}/13). Se deben responder las 3 exploraciones y las 10 decisiones.` 
      };
    }

    const now = new Date().toISOString();
    const closedVersion: DiamondVersion = {
      ...version,
      status: 'closed',
      closedAt: now,
      confirmedBy: this.currentUser.id
    };

    const closure: ModuleClosure = {
      id: 'cls-dia-' + Date.now(),
      journeyId: journey.id,
      module: 'diamond',
      editionNo: closedVersion.versionNumber,
      diamondVersionId: closedVersion.id,
      closedAt: now,
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(closedVersion)),
      snapshotHash: 'hash-' + closedVersion.id + '-' + Date.now()
    };

    const updatedJourney: JourneyData = {
      ...journey,
      diamondSlotA: slot === 'A' ? closedVersion : journey.diamondSlotA,
      diamondSlotB: slot === 'B' ? closedVersion : journey.diamondSlotB,
      closures: [...journey.closures, closure],
      updatedAt: now
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.logAudit(
      'DIAMOND_CLOSED', 
      'diamond_version', 
      closedVersion.id, 
      `Confirmado y cerrado diamante versión ${closedVersion.versionNumber} (Slot ${slot})`,
      journey.id
    );

    // Asynchronous remote persistence
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('arq_diamond_versions').update({
            status: 'closed',
            closed_at: now,
            confirmed_by: this.currentUser!.id
          }).eq('id', closedVersion.id);

          await supabase.from('arq_module_closures').insert({
            journey_id: journey.id,
            module: 'diamond',
            edition_no: closedVersion.versionNumber,
            diamond_version_id: closedVersion.id,
            snapshot: closedVersion,
            snapshot_hash: closure.snapshotHash,
            confirmed_by: this.currentUser!.id,
            closed_at: now
          });
        } catch (e) {
          console.warn('[Supabase] Error persisting diamond closure:', e);
        }
      })();
    }

    return { success: true };
  }

  public createSecondVersion(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    if (!journey.diamondSlotA || journey.diamondSlotA.status !== 'closed') {
      return { success: false, error: 'Debes confirmar y fijar tu versión inicial antes de crear una actualización.' };
    }
    if (journey.diamondSlotB) {
      return { success: false, error: 'Ya existe una segunda versión en curso.' };
    }

    const v2Id = `dia-${this.currentUser.id}-v2`;
    const v2: DiamondVersion = {
      id: v2Id,
      journeyId: journey.id,
      versionNumber: 2,
      slot: 'B',
      status: 'draft',
      startedAt: new Date().toISOString(),
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      personalAnswers: ['', '', '', '', ''],
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      diamondSlotB: v2,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.logAudit('DIAMOND_V2_CREATED', 'diamond_version', v2.id, 'Creación de segunda versión temporal (Slot B)', journey.id);

    // Persist remote version row in Supabase
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const { data, error } = await supabase.from('arq_diamond_versions').insert({
            journey_id: journey.id,
            version_number: 2,
            slot: 'B',
            status: 'draft',
            revision: 1
          }).select().single();

          if (data && !error) {
            v2.id = data.id;
            this.persistLocal();
          }
        } catch (e) {
          console.warn('[Supabase] Error creating diamond v2:', e);
        }
      })();
    }

    return { success: true };
  }

  public renewDiamondAtomic(idempotencyKey: string): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    if (!journey.diamondSlotA || journey.diamondSlotA.status !== 'closed' ||
        !journey.diamondSlotB || journey.diamondSlotB.status !== 'closed') {
      return { success: false, error: 'Ambas versiones deben estar cerradas y confirmadas para iniciar un nuevo ciclo.' };
    }

    const existingConsent = this.replacementConsents.find(c => c.idempotencyKey === idempotencyKey);
    if (existingConsent) {
      return { success: true };
    }

    const oldA = journey.diamondSlotA;
    const recentB = journey.diamondSlotB;
    const nextVersionNum = Math.max(oldA.versionNumber, recentB.versionNumber) + 1;

    // 1. Mover Slot B a Slot A
    const movedA: DiamondVersion = {
      ...recentB,
      slot: 'A'
    };

    // 2. Crear nueva vN en Slot B
    const newB: DiamondVersion = {
      id: `dia-${this.currentUser.id}-v${nextVersionNum}`,
      journeyId: journey.id,
      versionNumber: nextVersionNum,
      slot: 'B',
      status: 'draft',
      startedAt: new Date().toISOString(),
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      personalAnswers: ['', '', '', '', ''],
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      diamondSlotA: movedA,
      diamondSlotB: newB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);

    const consent: ReplacementConsent = {
      id: 'cst-' + Date.now(),
      journeyId: journey.id,
      oldVersionId: oldA.id,
      recentVersionId: recentB.id,
      newVersionId: newB.id,
      consentedAt: new Date().toISOString(),
      idempotencyKey,
      actorEmail: this.currentUser.email
    };
    this.replacementConsents.push(consent);
    this.persistLocal();

    this.logAudit(
      'DIAMOND_RENEWAL', 
      'diamond_version', 
      newB.id, 
      `Sustitución consentida: v${oldA.versionNumber} reemplazada; v${recentB.versionNumber} pasa a Slot A; nueva v${nextVersionNum} en Slot B`,
      journey.id
    );

    // Call stored procedure on Supabase
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.rpc('arq_renew_diamond', {
            p_journey_id: journey.id,
            p_old_version_id: oldA.id,
            p_recent_version_id: recentB.id,
            p_idempotency_key: idempotencyKey
          });
        } catch (e) {
          console.warn('[Supabase] Error calling arq_renew_diamond:', e);
        }
      })();
    }

    return { success: true };
  }

  // --- Professional Diamond API ---

  public saveProfDiamondContext(slot: 'A' | 'B', key: ContextKey, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return false;

    const targetVersion = slot === 'A' ? journey.profDiamondSlotA : journey.profDiamondSlotB;
    if (!targetVersion || targetVersion.status === 'closed') return false;

    const updatedVersion: ProfDiamondVersion = {
      ...targetVersion,
      contexts: {
        ...targetVersion.contexts,
        [key]: value
      },
      revision: targetVersion.revision + 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      profDiamondSlotA: slot === 'A' ? updatedVersion : journey.profDiamondSlotA,
      profDiamondSlotB: slot === 'B' ? updatedVersion : journey.profDiamondSlotB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.debouncedSaveProfDiamondContext(targetVersion.id, key, value);
    return true;
  }

  private debouncedSaveProfDiamondContext = debounce(async (versionId: string, key: ContextKey, value: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_prof_diamond_contexts').upsert({
        version_id: versionId,
        context_key: key,
        body: value,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving prof diamond context:', err);
    }
  }, 400);

  public saveProfDiamondChoice(slot: 'A' | 'B', index: number, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return false;

    const targetVersion = slot === 'A' ? journey.profDiamondSlotA : journey.profDiamondSlotB;
    if (!targetVersion || targetVersion.status === 'closed') return false;

    const newProfessional = [...targetVersion.professionalAnswers];
    newProfessional[index] = value;

    const updatedVersion: ProfDiamondVersion = {
      ...targetVersion,
      professionalAnswers: newProfessional,
      revision: targetVersion.revision + 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      profDiamondSlotA: slot === 'A' ? updatedVersion : journey.profDiamondSlotA,
      profDiamondSlotB: slot === 'B' ? updatedVersion : journey.profDiamondSlotB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.debouncedSaveProfDiamondChoice(targetVersion.id, index, value);
    return true;
  }

  private debouncedSaveProfDiamondChoice = debounce(async (versionId: string, index: number, value: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_prof_diamond_answers').upsert({
        version_id: versionId,
        decision_index: index,
        body: value,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving prof diamond choice:', err);
    }
  }, 400);

  public closeProfDiamond(slot: 'A' | 'B'): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    const version = slot === 'A' ? journey.profDiamondSlotA : journey.profDiamondSlotB;
    if (!version) return { success: false, error: 'Versión inexistente.' };
    if (version.status === 'closed') return { success: false, error: 'Esta versión ya fue confirmada y cerrada.' };

    const progress = calculateProfDiamondProgress(version);
    if (!progress.readyToClose) {
      return { 
        success: false, 
        error: `Requisitos incompletos (${progress.totalUnits}/8). Se deben responder las 3 exploraciones y las 5 decisiones profesionales.` 
      };
    }

    const now = new Date().toISOString();
    const closedVersion: ProfDiamondVersion = {
      ...version,
      status: 'closed',
      closedAt: now,
      confirmedBy: this.currentUser.id
    };

    const closure: ModuleClosure = {
      id: 'cls-dia-pro-' + Date.now(),
      journeyId: journey.id,
      module: 'diamond_pro',
      editionNo: closedVersion.versionNumber,
      diamondVersionId: closedVersion.id,
      closedAt: now,
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(closedVersion)),
      snapshotHash: 'hash-' + closedVersion.id + '-' + Date.now()
    };

    const updatedJourney: JourneyData = {
      ...journey,
      profDiamondSlotA: slot === 'A' ? closedVersion : journey.profDiamondSlotA,
      profDiamondSlotB: slot === 'B' ? closedVersion : journey.profDiamondSlotB,
      closures: [...journey.closures, closure],
      updatedAt: now
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.logAudit(
      'PROF_DIAMOND_CLOSED', 
      'prof_diamond_version', 
      closedVersion.id, 
      `Confirmado y cerrado Diamante Profesional versión ${closedVersion.versionNumber} (Slot ${slot})`,
      journey.id
    );

    // Remote persistence
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('arq_prof_diamond_versions').update({
            status: 'closed',
            closed_at: now,
            confirmed_by: this.currentUser!.id
          }).eq('id', closedVersion.id);

          await supabase.from('arq_module_closures').insert({
            journey_id: journey.id,
            module: 'diamond_pro',
            edition_no: closedVersion.versionNumber,
            diamond_version_id: closedVersion.id,
            snapshot: closedVersion,
            snapshot_hash: closure.snapshotHash,
            confirmed_by: this.currentUser!.id,
            closed_at: now
          });
        } catch (e) {
          console.warn('[Supabase] Error persisting prof diamond closure:', e);
        }
      })();
    }

    return { success: true };
  }

  public createSecondProfDiamondVersion(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.journeys.get(this.currentUser.id);
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    if (!journey.profDiamondSlotA || journey.profDiamondSlotA.status !== 'closed') {
      return { success: false, error: 'Debes confirmar y fijar tu versión inicial antes de crear una actualización.' };
    }
    if (journey.profDiamondSlotB) {
      return { success: false, error: 'Ya existe una segunda versión en curso.' };
    }

    const v2Id = `dia-pro-${this.currentUser.id}-v2`;
    const v2: ProfDiamondVersion = {
      id: v2Id,
      journeyId: journey.id,
      versionNumber: 2,
      slot: 'B',
      status: 'draft',
      startedAt: new Date().toISOString(),
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      profDiamondSlotB: v2,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);
    this.persistLocal();

    this.logAudit('PROF_DIAMOND_V2_CREATED', 'prof_diamond_version', v2.id, 'Creación de segunda versión temporal de Diamante Profesional (Slot B)', journey.id);

    if (isSupabaseConfigured) {
      (async () => {
        try {
          const { data, error } = await supabase.from('arq_prof_diamond_versions').insert({
            journey_id: journey.id,
            version_number: 2,
            slot: 'B',
            status: 'draft',
            revision: 1
          }).select().single();

          if (data && !error) {
            v2.id = data.id;
            this.persistLocal();
          }
        } catch (e) {
          console.warn('[Supabase] Error creating prof diamond v2:', e);
        }
      })();
    }

    return { success: true };
  }

  public renewProfDiamondAtomic(idempotencyKey: string): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    if (!journey.profDiamondSlotA || journey.profDiamondSlotA.status !== 'closed' ||
        !journey.profDiamondSlotB || journey.profDiamondSlotB.status !== 'closed') {
      return { success: false, error: 'Ambas versiones del Diamante Profesional deben estar cerradas y confirmadas para iniciar un nuevo ciclo.' };
    }

    const existingConsent = this.replacementConsents.find(c => c.idempotencyKey === idempotencyKey);
    if (existingConsent) {
      return { success: true };
    }

    const oldA = journey.profDiamondSlotA;
    const recentB = journey.profDiamondSlotB;
    const nextVersionNum = Math.max(oldA.versionNumber, recentB.versionNumber) + 1;

    // 1. Mover Slot B a Slot A
    const movedA: ProfDiamondVersion = {
      ...recentB,
      slot: 'A'
    };

    // 2. Crear nueva vN en Slot B
    const newB: ProfDiamondVersion = {
      id: `dia-pro-${this.currentUser.id}-v${nextVersionNum}`,
      journeyId: journey.id,
      versionNumber: nextVersionNum,
      slot: 'B',
      status: 'draft',
      startedAt: new Date().toISOString(),
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    const updatedJourney: JourneyData = {
      ...journey,
      profDiamondSlotA: movedA,
      profDiamondSlotB: newB,
      updatedAt: new Date().toISOString()
    };

    this.journeys.set(journey.ownerId, updatedJourney);

    const consent: ReplacementConsent = {
      id: 'cst-pro-' + Date.now(),
      journeyId: journey.id,
      oldVersionId: oldA.id,
      recentVersionId: recentB.id,
      newVersionId: newB.id,
      consentedAt: new Date().toISOString(),
      idempotencyKey,
      actorEmail: this.currentUser.email
    };
    this.replacementConsents.push(consent);
    this.persistLocal();

    this.logAudit(
      'PROF_DIAMOND_RENEWAL', 
      'prof_diamond_version', 
      newB.id, 
      `Sustitución consentida: Diamante Profesional v${oldA.versionNumber} reemplazada; v${recentB.versionNumber} pasa a Slot A; nueva v${nextVersionNum} en Slot B`,
      journey.id
    );

    // Call stored procedure on Supabase
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.rpc('arq_renew_prof_diamond', {
            p_journey_id: journey.id,
            p_old_version_id: oldA.id,
            p_recent_version_id: recentB.id,
            p_idempotency_key: idempotencyKey
          });
        } catch (e) {
          console.warn('[Supabase] Error calling arq_renew_prof_diamond:', e);
        }
      })();
    }

    return { success: true };
  }

  // --- Thresholds API ---

  public saveThreshold(key: string, status: ThresholdStatus, reflection: string, evidence: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const t = journey.thresholds.find(item => item.key === key);
    if (!t) return false;

    if ((t.status && t.status !== status) || (t.reflection && t.reflection !== reflection)) {
      t.history.unshift({
        id: 'the-' + Date.now(),
        occurredAt: new Date().toISOString(),
        priorStatus: t.status,
        newStatus: status,
        priorReflection: t.reflection,
        newReflection: reflection,
        actorId: this.currentUser.id
      });
      if (t.history.length > 20) t.history.pop();
    }

    t.status = status;
    t.reflection = reflection;
    t.evidence = evidence;
    t.updatedAt = new Date().toISOString();
    journey.updatedAt = new Date().toISOString();

    this.persistLocal();

    this.debouncedSaveThreshold(journey.id, key, status, reflection, evidence);
    return true;
  }

  private debouncedSaveThreshold = debounce(async (journeyId: string, key: string, status: ThresholdStatus, reflection: string, evidence: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_threshold_records').upsert({
        journey_id: journeyId,
        threshold_key: key,
        status,
        reflection,
        evidence,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving threshold:', err);
    }
  }, 400);

  public closeThresholds(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    const progress = calculateThresholdsProgress(journey.thresholds);
    if (!progress.readyToClose) {
      return { success: false, error: `Se deben completar los 7 umbrales con estado y evidencia (${progress.validCount}/7).` };
    }

    const now = new Date().toISOString();
    const closure: ModuleClosure = {
      id: 'cls-thr-' + Date.now(),
      journeyId: journey.id,
      module: 'thresholds',
      editionNo: 1,
      closedAt: now,
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(journey.thresholds)),
      snapshotHash: 'hash-thr-' + Date.now()
    };
    journey.closures.push(closure);
    journey.updatedAt = now;
    this.persistLocal();

    this.logAudit('THRESHOLDS_CLOSED', 'module_closure', closure.id, 'Confirmado y cerrado módulo de Siete Umbrales (7/7)', journey.id);

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('arq_module_closures').insert({
            journey_id: journey.id,
            module: 'thresholds',
            edition_no: 1,
            snapshot: journey.thresholds,
            snapshot_hash: closure.snapshotHash,
            confirmed_by: this.currentUser!.id,
            closed_at: now
          });
        } catch (e) {
          console.warn('[Supabase] Error persisting thresholds closure:', e);
        }
      })();
    }

    return { success: true };
  }

  // --- Letters API ---

  public saveLetter(dimension: Dimension, body: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    journey.letters[dimension].body = body;
    journey.letters[dimension].updatedAt = new Date().toISOString();
    journey.updatedAt = new Date().toISOString();
    this.persistLocal();

    this.debouncedSaveLetter(journey.id, dimension, body);
    return true;
  }

  private debouncedSaveLetter = debounce(async (journeyId: string, dimension: Dimension, body: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_letters').upsert({
        journey_id: journeyId,
        dimension,
        body,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving letter:', err);
    }
  }, 400);

  public sealIndividualLetter(dimension: Dimension): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const now = new Date().toISOString();
    journey.letters[dimension].isSealed = true;
    journey.letters[dimension].sealedAt = now;
    journey.updatedAt = now;
    this.persistLocal();
    this.logAudit('LETTER_SEALED', 'letter', dimension, `Carta ${dimension} sellada individualmente`);

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('arq_letters').update({
            is_sealed: true,
            sealed_at: now,
            updated_at: now
          }).eq('journey_id', journey.id).eq('dimension', dimension);
        } catch (e) {
          console.warn('[Supabase] Error sealing letter:', e);
        }
      })();
    }

    return true;
  }

  public closeLetters(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    const progress = calculateLettersProgress(journey.letters);
    if (!progress.readyToClose) {
      return { success: false, error: `Se deben completar ambas cartas (personal y profesional) para el informe final (${progress.validCount}/2).` };
    }

    const now = new Date().toISOString();
    const closure: ModuleClosure = {
      id: 'cls-let-' + Date.now(),
      journeyId: journey.id,
      module: 'letters',
      editionNo: 1,
      closedAt: now,
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(journey.letters)),
      snapshotHash: 'hash-let-' + Date.now()
    };
    journey.closures.push(closure);
    journey.updatedAt = now;
    this.persistLocal();

    this.logAudit('LETTERS_CLOSED', 'module_closure', closure.id, 'Confirmado y cerrado módulo Cartas al Futuro (2/2)', journey.id);

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('arq_module_closures').insert({
            journey_id: journey.id,
            module: 'letters',
            edition_no: 1,
            snapshot: journey.letters,
            snapshot_hash: closure.snapshotHash,
            confirmed_by: this.currentUser!.id,
            closed_at: now
          });
        } catch (e) {
          console.warn('[Supabase] Error persisting letters closure:', e);
        }
      })();
    }

    return { success: true };
  }

  // --- Interventions API ---

  public saveIntervention(key: string, kind: InterventionKind, actionText: string, evidenceText: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const item = journey.interventions.find(i => i.key === key);
    if (!item) return false;

    item.kind = kind;
    item.actionText = actionText;
    item.evidenceText = evidenceText;
    item.updatedAt = new Date().toISOString();
    journey.updatedAt = new Date().toISOString();
    this.persistLocal();

    this.debouncedSaveIntervention(journey.id, key, item.thresholdKey, kind, actionText, evidenceText);
    return true;
  }

  private debouncedSaveIntervention = debounce(async (
    journeyId: string, 
    key: string, 
    thresholdKey: string, 
    kind: InterventionKind, 
    actionText: string, 
    evidenceText: string
  ) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('arq_interventions').upsert({
        journey_id: journeyId,
        intervention_key: key,
        threshold_key: thresholdKey,
        kind,
        action_text: actionText,
        evidence_text: evidenceText,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Error saving intervention:', err);
    }
  }, 400);

  // --- Audit Trail ---

  public logAudit(eventType: string, targetKind: string, targetId: string, details?: string, journeyId?: string) {
    const event: AuditEvent = {
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actorId: this.currentUser?.id || 'anonymous',
      actorEmail: this.currentUser?.email || 'anonymous',
      eventType,
      targetKind,
      targetId,
      journeyId,
      occurredAt: new Date().toISOString(),
      details
    };
    this.auditEvents.unshift(event);
    if (this.auditEvents.length > 200) this.auditEvents.pop();
    this.persistLocal();

    if (isSupabaseConfigured && this.currentUser) {
      (async () => {
        try {
          await supabase.from('arq_audit_events').insert({
            actor_id: this.currentUser!.id,
            journey_id: journeyId || null,
            event_type: eventType,
            target_kind: targetKind,
            target_id: targetId,
            details: details || null,
            occurred_at: event.occurredAt
          });
        } catch (e) {
          console.warn('[Supabase] Error logging audit event:', e);
        }
      })();
    }
  }

  // --- Administration API ---

  public async loadAdminData(): Promise<void> {
    if (!this.currentUser || this.currentUser.role !== 'admin' || !isSupabaseConfigured) {
      return;
    }

    try {
      // 1. Cargar participantes reales de Supabase
      const { data: profiles, error: pErr } = await supabase
        .from('arq_profiles')
        .select('*');

      if (!pErr && profiles) {
        for (const p of profiles) {
          const { data: jRow } = await supabase
            .from('arq_journeys')
            .select('*')
            .eq('owner_id', p.id)
            .maybeSingle();

          if (jRow) {
            const assembled = await this.assembleJourneyFromDatabase(jRow, {
              id: p.id,
              email: p.email,
              name: p.name,
              role: p.role,
              createdAt: p.created_at
            });
            this.journeys.set(p.id, assembled);
          }
        }
      }

      // 2. Cargar auditoría completa de Supabase
      const { data: auditRows, error: aErr } = await supabase
        .from('arq_audit_events')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(200);

      if (!aErr && auditRows) {
        this.auditEvents = auditRows.map((a: any) => ({
          id: a.id,
          journeyId: a.journey_id || undefined,
          actorId: a.actor_id,
          actorEmail: profiles?.find((p: any) => p.id === a.actor_id)?.email || 'Participante',
          eventType: a.event_type,
          targetKind: a.target_kind,
          targetId: a.target_id,
          occurredAt: a.occurred_at,
          details: a.details || undefined
        }));
      }

      this.persistLocal();
    } catch (err) {
      console.error('[Admin] Error loading live admin data:', err);
    }
  }

  public getAdminReceipts(): JourneyData[] {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return [];
    }
    return Array.from(this.journeys.values());
  }

  public getAdminParticipantDetail(journeyId: string): JourneyData | null {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return null;
    }
    const found = Array.from(this.journeys.values()).find(j => j.id === journeyId);
    if (found) {
      this.logAudit('ADMIN_VIEW_DOSSIER', 'journey', found.id, `Consulta autorizada de expediente: ${found.ownerEmail}`);
    }
    return found || null;
  }

  public getAuditEvents(): AuditEvent[] {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return [];
    }
    return [...this.auditEvents];
  }
}

export const repository = new DataRepository();
