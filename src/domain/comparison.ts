import { DiamondVersion, ContextKey } from '../types/domain';
import { CANONICAL_EXPLORATIONS, CANONICAL_STAGES } from './constants';

export type DiffStatus = 'sin_cambios' | 'modificado' | 'agregado';

export interface ChoiceComparisonItem {
  dimension: 'personal' | 'profesional';
  index: number;
  title: string;
  question: string;
  answerA: string;
  answerB: string;
  status: DiffStatus;
}

export interface ExplorationComparisonItem {
  key: ContextKey;
  title: string;
  question: string;
  contextA: string;
  contextB: string;
  status: DiffStatus;
}

function computeDiff(a?: string, b?: string): DiffStatus {
  const cleanA = (a || '').trim();
  const cleanB = (b || '').trim();

  if (!cleanA && !cleanB) return 'sin_cambios';
  if (!cleanA && cleanB) return 'agregado';
  if (cleanA === cleanB) return 'sin_cambios';
  return 'modificado';
}

export function compareDiamondVersions(
  versionA: DiamondVersion | null,
  versionB: DiamondVersion | null
): {
  explorations: ExplorationComparisonItem[];
  personalChoices: ChoiceComparisonItem[];
  professionalChoices: ChoiceComparisonItem[];
  summary: {
    totalFields: number; // 13
    modified: number;
    added: number;
    unchanged: number;
  };
} {
  const explorations: ExplorationComparisonItem[] = CANONICAL_EXPLORATIONS.map(exp => {
    const textA = versionA?.contexts?.[exp.key] || '';
    const textB = versionB?.contexts?.[exp.key] || '';
    return {
      key: exp.key,
      title: exp.title,
      question: exp.question,
      contextA: textA,
      contextB: textB,
      status: computeDiff(textA, textB)
    };
  });

  const personalChoices: ChoiceComparisonItem[] = CANONICAL_STAGES.map(stage => {
    const textA = versionA?.personalAnswers?.[stage.index] || '';
    const textB = versionB?.personalAnswers?.[stage.index] || '';
    return {
      dimension: 'personal',
      index: stage.index,
      title: stage.title,
      question: stage.coreQuestion,
      answerA: textA,
      answerB: textB,
      status: computeDiff(textA, textB)
    };
  });

  const professionalChoices: ChoiceComparisonItem[] = CANONICAL_STAGES.map(stage => {
    const textA = versionA?.professionalAnswers?.[stage.index] || '';
    const textB = versionB?.professionalAnswers?.[stage.index] || '';
    return {
      dimension: 'profesional',
      index: stage.index,
      title: stage.title,
      question: stage.coreQuestion,
      answerA: textA,
      answerB: textB,
      status: computeDiff(textA, textB)
    };
  });

  const allStatuses = [
    ...explorations.map(e => e.status),
    ...personalChoices.map(c => c.status),
    ...professionalChoices.map(c => c.status)
  ];

  return {
    explorations,
    personalChoices,
    professionalChoices,
    summary: {
      totalFields: allStatuses.length,
      modified: allStatuses.filter(s => s === 'modificado').length,
      added: allStatuses.filter(s => s === 'agregado').length,
      unchanged: allStatuses.filter(s => s === 'sin_cambios').length
    }
  };
}
