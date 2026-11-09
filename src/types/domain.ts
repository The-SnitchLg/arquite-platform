export type Role = 'participant' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export type Dimension = 'personal' | 'profesional';
export type ContextKey = 'entorno' | 'talentos' | 'posibilidades';
export type DiamondSlot = 'A' | 'B';
export type DiamondStatus = 'draft' | 'closed';

export interface DiamondVersion {
  id: string;
  journeyId: string;
  versionNumber: number;
  slot: DiamondSlot;
  status: DiamondStatus;
  startedAt: string;
  closedAt?: string;
  confirmedBy?: string;
  contexts: Record<ContextKey, string>;
  personalAnswers: string[]; // 5 choices
  professionalAnswers: string[]; // 5 choices
  revision: number;
}

export interface ProfDiamondVersion {
  id: string;
  journeyId: string;
  versionNumber: number;
  slot: DiamondSlot;
  status: DiamondStatus;
  startedAt: string;
  closedAt?: string;
  confirmedBy?: string;
  contexts: Record<ContextKey, string>;
  professionalAnswers: string[]; // 5 choices
  revision: number;
}

export type ThresholdStatus = 
  | 'sin_iniciar' 
  | 'en_exploracion' 
  | 'accion_experimentada' 
  | 'cambio_documentado';

export interface ThresholdEvent {
  id: string;
  occurredAt: string;
  priorStatus: ThresholdStatus;
  newStatus: ThresholdStatus;
  priorReflection: string;
  newReflection: string;
  actorId: string;
}

export interface ThresholdRecord {
  key: string; // 'U01'..'U07'
  status: ThresholdStatus;
  reflection: string;
  evidence: string;
  updatedAt: string;
  history: ThresholdEvent[];
}

export type InterventionKind = 'cognitivo' | 'emocional' | 'simbólico' | 'estratégico';

export interface InterventionRecord {
  key: string; // 'I01'..'I07'
  thresholdKey: string;
  kind: InterventionKind;
  actionText: string;
  evidenceText: string;
  updatedAt: string;
}

export interface LetterRecord {
  dimension: Dimension;
  body: string;
  updatedAt: string;
  isSealed: boolean;
  sealedAt?: string;
}

export type ModuleType = 'diamond' | 'diamond_pro' | 'thresholds' | 'letters';

export interface ModuleClosure {
  id: string;
  journeyId: string;
  module: ModuleType;
  editionNo: number;
  diamondVersionId?: string;
  closedAt: string;
  confirmedBy: string;
  snapshot: any;
  snapshotHash: string;
}

export interface ReplacementConsent {
  id: string;
  journeyId: string;
  oldVersionId: string;
  recentVersionId: string;
  newVersionId: string;
  consentedAt: string;
  idempotencyKey: string;
  actorEmail: string;
}

export interface AuditEvent {
  id: string;
  journeyId?: string;
  actorId: string;
  actorEmail: string;
  eventType: string;
  targetKind: string;
  targetId: string;
  occurredAt: string;
  details?: string;
}

export interface JourneyData {
  id: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  diamondSlotA: DiamondVersion | null;
  diamondSlotB: DiamondVersion | null;
  profDiamondSlotA: ProfDiamondVersion | null;
  profDiamondSlotB: ProfDiamondVersion | null;
  thresholds: ThresholdRecord[];
  interventions: InterventionRecord[];
  letters: Record<Dimension, LetterRecord>;
  closures: ModuleClosure[];
}

export interface ProgressSummary {
  explorationsValid: number; // 0..3
  decisionsPersonalValid: number; // 0..5
  decisionsProfessionalValid: number; // 0..5
  diamondFacets: number; // 0..10
  diamondTotalUnits: number; // 0..13
  diamondReadyToClose: boolean; // 13/13
  diamondIsClosed: boolean;
  
  thresholdsValid: number; // 0..7
  thresholdsReadyToClose: boolean;
  thresholdsIsClosed: boolean;
  
  interventionsValid: number; // 0..7
  
  lettersValid: number; // 0..2
  lettersReadyToClose: boolean;
  lettersIsClosed: boolean;
  
  totalUnits: number; // 0..29
  globalPct: number; // 0..100
}
