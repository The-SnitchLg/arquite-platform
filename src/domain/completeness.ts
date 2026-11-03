import { DiamondVersion, ThresholdRecord, InterventionRecord, LetterRecord, ProgressSummary, Dimension } from '../types/domain';
import { isValidNarrative } from './constants';

export function calculateDiamondProgress(version: DiamondVersion | null): {
  explorationsValid: number;
  decisionsPersonalValid: number;
  decisionsProfessionalValid: number;
  facets: number;
  totalUnits: number;
  readyToClose: boolean;
  isClosed: boolean;
} {
  if (!version) {
    return {
      explorationsValid: 0,
      decisionsPersonalValid: 0,
      decisionsProfessionalValid: 0,
      facets: 0,
      totalUnits: 0,
      readyToClose: false,
      isClosed: false
    };
  }

  const expCount = Object.values(version.contexts).filter(isValidNarrative).length;
  const persCount = (version.personalAnswers || []).filter(isValidNarrative).length;
  const profCount = (version.professionalAnswers || []).filter(isValidNarrative).length;
  const facets = persCount + profCount; // 0..10
  const totalUnits = expCount + facets; // 0..13
  const readyToClose = totalUnits === 13;
  const isClosed = version.status === 'closed';

  return {
    explorationsValid: expCount,
    decisionsPersonalValid: persCount,
    decisionsProfessionalValid: profCount,
    facets,
    totalUnits,
    readyToClose,
    isClosed
  };
}

export function calculateThresholdsProgress(thresholds: ThresholdRecord[] = []): {
  validCount: number;
  readyToClose: boolean;
} {
  const validCount = thresholds.filter(
    t => t.status && t.status !== 'sin_iniciar' && isValidNarrative(t.reflection)
  ).length;

  return {
    validCount,
    readyToClose: validCount === 7
  };
}

export function calculateInterventionsProgress(interventions: InterventionRecord[] = []): {
  validCount: number;
  readyToClose: boolean;
} {
  const validCount = interventions.filter(
    i => Boolean(i.kind) && isValidNarrative(i.actionText) && isValidNarrative(i.evidenceText)
  ).length;

  return {
    validCount,
    readyToClose: validCount === 7
  };
}

export function calculateLettersProgress(letters: Record<Dimension, LetterRecord>): {
  validCount: number;
  readyToClose: boolean;
} {
  let count = 0;
  if (letters?.personal && isValidNarrative(letters.personal.body)) count++;
  if (letters?.profesional && isValidNarrative(letters.profesional.body)) count++;

  return {
    validCount: count,
    readyToClose: count === 2
  };
}

export function calculateGlobalProgress(
  activeDiamond: DiamondVersion | null,
  thresholds: ThresholdRecord[],
  interventions: InterventionRecord[],
  letters: Record<Dimension, LetterRecord>,
  closuresCount: { diamond: boolean; thresholds: boolean; letters: boolean }
): ProgressSummary {
  const d = calculateDiamondProgress(activeDiamond);
  const t = calculateThresholdsProgress(thresholds);
  const i = calculateInterventionsProgress(interventions);
  const l = calculateLettersProgress(letters);

  // Global universe: 29 units = 3 exp + 10 dec + 7 umbrales + 7 interv + 2 cartas
  const totalUnits = d.totalUnits + t.validCount + i.validCount + l.validCount;
  const globalPct = Math.round((totalUnits / 29) * 100);

  return {
    explorationsValid: d.explorationsValid,
    decisionsPersonalValid: d.decisionsPersonalValid,
    decisionsProfessionalValid: d.decisionsProfessionalValid,
    diamondFacets: d.facets,
    diamondTotalUnits: d.totalUnits,
    diamondReadyToClose: d.readyToClose,
    diamondIsClosed: closuresCount.diamond,

    thresholdsValid: t.validCount,
    thresholdsReadyToClose: t.readyToClose,
    thresholdsIsClosed: closuresCount.thresholds,

    interventionsValid: i.validCount,

    lettersValid: l.validCount,
    lettersReadyToClose: l.readyToClose,
    lettersIsClosed: closuresCount.letters,

    totalUnits,
    globalPct
  };
}
