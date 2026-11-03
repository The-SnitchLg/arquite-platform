import { 
  UserProfile, 
  JourneyData, 
  DiamondVersion, 
  ContextKey, 
  Dimension, 
  ThresholdStatus, 
  InterventionKind, 
  AuditEvent,
  ModuleClosure,
  ReplacementConsent 
} from '../types/domain';
import { 
  ADMIN_USER, 
  DEMO_PARTICIPANT, 
  createEmptyJourney, 
  createSampleJourneyForAdminDemo 
} from './seed';
import { calculateDiamondProgress, calculateThresholdsProgress, calculateLettersProgress } from '../domain/completeness';

const STORAGE_KEY_USER = 'arquite_current_user';
const STORAGE_KEY_JOURNEYS = 'arquite_journeys_v1';
const STORAGE_KEY_AUDIT = 'arquite_audit_v1';
const STORAGE_KEY_CONSENTS = 'arquite_consents_v1';

class DataRepository {
  private currentUser: UserProfile | null = null;
  private journeys: Map<string, JourneyData> = new Map();
  private auditEvents: AuditEvent[] = [];
  private replacementConsents: ReplacementConsent[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // 1. Load Current User
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch {
      this.currentUser = null;
    }

    // 2. Load Journeys
    try {
      const savedJourneys = localStorage.getItem(STORAGE_KEY_JOURNEYS);
      if (savedJourneys) {
        const parsed: JourneyData[] = JSON.parse(savedJourneys);
        parsed.forEach(j => this.journeys.set(j.ownerId, j));
      }
    } catch {
      // Fallback
    }

    // Ensure sample data exists if empty
    if (!this.journeys.has(DEMO_PARTICIPANT.id)) {
      const sample = createSampleJourneyForAdminDemo();
      this.journeys.set(sample.ownerId, sample);
      this.persistJourneys();
    }

    // 3. Load Audit Logs
    try {
      const savedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (savedAudit) {
        this.auditEvents = JSON.parse(savedAudit);
      }
    } catch {
      this.auditEvents = [];
    }

    // 4. Load Consents
    try {
      const savedConsents = localStorage.getItem(STORAGE_KEY_CONSENTS);
      if (savedConsents) {
        this.replacementConsents = JSON.parse(savedConsents);
      }
    } catch {
      this.replacementConsents = [];
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private persistJourneys() {
    try {
      const list = Array.from(this.journeys.values());
      localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not persist journeys to localStorage', e);
    }
    this.notify();
  }

  private logAudit(eventType: string, targetKind: string, targetId: string, details?: string, journeyId?: string) {
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
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditEvents));
    } catch {}
    this.notify();
  }

  // --- Auth API ---

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public login(email: string, pass: string): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();

    // Specific Admin Credentials requested by User
    if (cleanEmail === 'larrygomezg@gmail.com') {
      if (pass === 'barbara123') {
        this.currentUser = ADMIN_USER;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
        this.logAudit('ADMIN_LOGIN', 'auth', ADMIN_USER.id, 'Inicio de sesión administrativo exitoso');
        this.notify();
        return { success: true };
      } else {
        return { success: false, error: 'Contraseña incorrecta para cuenta de administrador.' };
      }
    }

    // Demo Participant
    if (cleanEmail === 'director@estudioarquite.com' || cleanEmail === 'participante@arquite.com') {
      this.currentUser = DEMO_PARTICIPANT;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      this.logAudit('PARTICIPANT_LOGIN', 'auth', DEMO_PARTICIPANT.id, 'Acceso de participante demo');
      this.notify();
      return { success: true };
    }

    // Any registered or new participant
    if (pass.length >= 6) {
      const existingJourney = Array.from(this.journeys.values()).find(j => j.ownerEmail.toLowerCase() === cleanEmail);
      if (existingJourney) {
        this.currentUser = {
          id: existingJourney.ownerId,
          email: existingJourney.ownerEmail,
          name: existingJourney.ownerName,
          role: 'participant',
          createdAt: existingJourney.createdAt
        };
      } else {
        const id = 'usr-' + Date.now().toString(36);
        const name = cleanEmail.split('@')[0];
        const newUser: UserProfile = {
          id,
          email: cleanEmail,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          role: 'participant',
          createdAt: new Date().toISOString()
        };
        this.currentUser = newUser;
        const newJourney = createEmptyJourney(newUser);
        this.journeys.set(newUser.id, newJourney);
        this.persistJourneys();
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      this.logAudit('PARTICIPANT_LOGIN', 'auth', this.currentUser.id, `Acceso como ${this.currentUser.email}`);
      this.notify();
      return { success: true };
    }

    return { success: false, error: 'Credenciales inválidas. La contraseña debe tener al menos 6 caracteres.' };
  }

  public register(name: string, email: string, pass: string): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !name.trim() || pass.length < 6) {
      return { success: false, error: 'Por favor completa todos los campos requeridos.' };
    }

    if (cleanEmail === 'larrygomezg@gmail.com') {
      return { success: false, error: 'Esta cuenta ya está reservada para administración. Usa la pantalla de acceso directivo.' };
    }

    const id = 'usr-' + Date.now().toString(36);
    const newUser: UserProfile = {
      id,
      email: cleanEmail,
      name: name.trim(),
      role: 'participant',
      createdAt: new Date().toISOString()
    };
    this.currentUser = newUser;
    const newJourney = createEmptyJourney(newUser);
    this.journeys.set(newUser.id, newJourney);
    this.persistJourneys();
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
    this.logAudit('PARTICIPANT_REGISTER', 'user', newUser.id, `Registro de nuevo participante: ${newUser.email}`);
    this.notify();
    return { success: true };
  }

  public logout() {
    if (this.currentUser) {
      this.logAudit('LOGOUT', 'auth', this.currentUser.id, 'Cierre de sesión voluntario');
    }
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);
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
      this.persistJourneys();
    }
    return journey || null;
  }

  public saveDiamondContext(slot: 'A' | 'B', key: ContextKey, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const version = slot === 'A' ? journey.diamondSlotA : journey.diamondSlotB;
    if (!version || version.status === 'closed') return false; // Invariant: closed is read-only

    version.contexts[key] = value;
    version.revision++;
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();
    return true;
  }

  public saveDiamondChoice(slot: 'A' | 'B', dimension: Dimension, index: number, value: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const version = slot === 'A' ? journey.diamondSlotA : journey.diamondSlotB;
    if (!version || version.status === 'closed') return false;

    if (dimension === 'personal') {
      version.personalAnswers[index] = value;
    } else {
      version.professionalAnswers[index] = value;
    }
    version.revision++;
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();
    return true;
  }

  public closeDiamond(slot: 'A' | 'B'): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
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

    // Freeze snapshot
    version.status = 'closed';
    version.closedAt = new Date().toISOString();
    version.confirmedBy = this.currentUser.id;

    const closure: ModuleClosure = {
      id: 'cls-dia-' + Date.now(),
      journeyId: journey.id,
      module: 'diamond',
      editionNo: version.versionNumber,
      diamondVersionId: version.id,
      closedAt: version.closedAt,
      confirmedBy: version.confirmedBy,
      snapshot: JSON.parse(JSON.stringify(version)),
      snapshotHash: 'hash-' + version.id + '-' + Date.now()
    };
    journey.closures.push(closure);
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();

    this.logAudit(
      'DIAMOND_CLOSED', 
      'diamond_version', 
      version.id, 
      `Confirmado y cerrado diamante versión ${version.versionNumber} (Slot ${slot})`,
      journey.id
    );
    return { success: true };
  }

  public createSecondVersion(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    if (!journey.diamondSlotA || journey.diamondSlotA.status !== 'closed') {
      return { success: false, error: 'Debes confirmar y fijar tu versión inicial antes de crear una actualización.' };
    }
    if (journey.diamondSlotB) {
      return { success: false, error: 'Ya existe una segunda versión en curso.' };
    }

    const v2: DiamondVersion = {
      id: `dia-${this.currentUser.id}-v2`,
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
    journey.diamondSlotB = v2;
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();

    this.logAudit('DIAMOND_V2_CREATED', 'diamond_version', v2.id, 'Creación de segunda versión temporal (Slot B)', journey.id);
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

    // Check idempotency
    const existingConsent = this.replacementConsents.find(c => c.idempotencyKey === idempotencyKey);
    if (existingConsent) {
      return { success: true };
    }

    const oldA = journey.diamondSlotA;
    const recentB = journey.diamondSlotB;
    const nextVersionNum = Math.max(oldA.versionNumber, recentB.versionNumber) + 1;

    // Atomic Swap
    // 1. Slot A is replaced by Recent B (moved to slot A)
    recentB.slot = 'A';
    journey.diamondSlotA = recentB;

    // 2. New Version vN is created empty in Slot B
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
    journey.diamondSlotB = newB;
    journey.updatedAt = new Date().toISOString();

    // 3. Register Consent & Audit
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
    localStorage.setItem(STORAGE_KEY_CONSENTS, JSON.stringify(this.replacementConsents));

    this.persistJourneys();

    this.logAudit(
      'DIAMOND_RENEWAL', 
      'diamond_version', 
      newB.id, 
      `Sustitución consentida: v${oldA.versionNumber} reemplazada; v${recentB.versionNumber} pasa a Slot A; nueva v${nextVersionNum} en Slot B`,
      journey.id
    );

    return { success: true };
  }

  // --- Thresholds API ---

  public saveThreshold(key: string, status: ThresholdStatus, reflection: string, evidence: string): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    const t = journey.thresholds.find(item => item.key === key);
    if (!t) return false;

    // If there is actual change in reflection or status, create history event
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

    this.persistJourneys();
    return true;
  }

  public closeThresholds(): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autenticado.' };
    const journey = this.getJourney();
    if (!journey) return { success: false, error: 'Recorrido no encontrado.' };

    const progress = calculateThresholdsProgress(journey.thresholds);
    if (!progress.readyToClose) {
      return { success: false, error: `Se deben completar los 7 umbrales con estado y evidencia (${progress.validCount}/7).` };
    }

    const closure: ModuleClosure = {
      id: 'cls-thr-' + Date.now(),
      journeyId: journey.id,
      module: 'thresholds',
      editionNo: 1,
      closedAt: new Date().toISOString(),
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(journey.thresholds)),
      snapshotHash: 'hash-thr-' + Date.now()
    };
    journey.closures.push(closure);
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();

    this.logAudit('THRESHOLDS_CLOSED', 'module_closure', closure.id, 'Confirmado y cerrado módulo de Siete Umbrales (7/7)', journey.id);
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
    this.persistJourneys();
    return true;
  }

  public sealIndividualLetter(dimension: Dimension): boolean {
    if (!this.currentUser) return false;
    const journey = this.getJourney();
    if (!journey) return false;

    journey.letters[dimension].isSealed = true;
    journey.letters[dimension].sealedAt = new Date().toISOString();
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();
    this.logAudit('LETTER_SEALED', 'letter', dimension, `Carta ${dimension} sellada individualmente`);
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

    const closure: ModuleClosure = {
      id: 'cls-let-' + Date.now(),
      journeyId: journey.id,
      module: 'letters',
      editionNo: 1,
      closedAt: new Date().toISOString(),
      confirmedBy: this.currentUser.id,
      snapshot: JSON.parse(JSON.stringify(journey.letters)),
      snapshotHash: 'hash-let-' + Date.now()
    };
    journey.closures.push(closure);
    journey.updatedAt = new Date().toISOString();
    this.persistJourneys();

    this.logAudit('LETTERS_CLOSED', 'module_closure', closure.id, 'Confirmado y cerrado módulo Cartas al Futuro (2/2)', journey.id);
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
    this.persistJourneys();
    return true;
  }

  // --- Administration API ---

  public getAdminReceipts(): JourneyData[] {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return [];
    }
    this.logAudit('ADMIN_VIEW_RECEIPTS', 'admin', 'receipts_table', 'Consulta de tabla general de recepciones');
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
