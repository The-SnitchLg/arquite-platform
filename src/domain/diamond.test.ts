import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidNarrative } from './constants.js';
import { calculateDiamondProgress } from './completeness.js';
import { DiamondVersion } from '../types/domain.js';

describe('Diamond Version 2 Independent Illumination', () => {
  const version1: DiamondVersion = {
    id: 'dia-v1',
    journeyId: 'jrn-1',
    versionNumber: 1,
    slot: 'A',
    status: 'closed',
    startedAt: '2026-10-01T00:00:00Z',
    closedAt: '2026-10-10T00:00:00Z',
    contexts: {
      entorno: 'Entorno de alta exigencia estratégica y liderazgo.',
      talentos: 'Capacidad de síntesis directiva y análisis sistémico.',
      posibilidades: 'Transición hacia la arquitectura estratégica.'
    },
    personalAnswers: [
      'Respuesta personal 1 con más de 10 caracteres válidos',
      'Respuesta personal 2 con más de 10 caracteres válidos',
      'Respuesta personal 3 con más de 10 caracteres válidos',
      'Respuesta personal 4 con más de 10 caracteres válidos',
      'Respuesta personal 5 con más de 10 caracteres válidos'
    ],
    professionalAnswers: [
      'Respuesta profesional 1 con más de 10 caracteres válidos',
      'Respuesta profesional 2 con más de 10 caracteres válidos',
      'Respuesta profesional 3 con más de 10 caracteres válidos',
      'Respuesta profesional 4 con más de 10 caracteres válidos',
      'Respuesta profesional 5 con más de 10 caracteres válidos'
    ],
    revision: 1
  };

  it('Version 1 has 10/10 active facets and is readyToClose/closed', () => {
    const prog1 = calculateDiamondProgress(version1);
    assert.strictEqual(prog1.facets, 10);
    assert.strictEqual(prog1.totalUnits, 13);
    assert.strictEqual(prog1.isClosed, true);
  });

  it('Version 2 illuminates progressively and independently for each facet without altering Version 1', () => {
    const version2: DiamondVersion = {
      id: 'dia-v2',
      journeyId: 'jrn-1',
      versionNumber: 2,
      slot: 'B',
      status: 'draft',
      startedAt: '2026-11-01T00:00:00Z',
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      personalAnswers: ['', '', '', '', ''],
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    // Initially 0 facets illuminated in Version 2
    let prog2 = calculateDiamondProgress(version2);
    assert.strictEqual(prog2.facets, 0);
    assert.strictEqual(prog2.decisionsPersonalValid, 0);
    assert.strictEqual(prog2.decisionsProfessionalValid, 0);

    // Complete 5 personal facets one by one
    for (let i = 0; i < 5; i++) {
      assert.strictEqual(isValidNarrative(version2.personalAnswers[i]), false);
      version2.personalAnswers[i] = `Elección estratégica personal número ${i + 1} válida`;
      assert.strictEqual(isValidNarrative(version2.personalAnswers[i]), true);

      prog2 = calculateDiamondProgress(version2);
      assert.strictEqual(prog2.decisionsPersonalValid, i + 1);
      assert.strictEqual(prog2.facets, i + 1);
    }

    // Complete 5 professional facets one by one
    for (let i = 0; i < 5; i++) {
      assert.strictEqual(isValidNarrative(version2.professionalAnswers[i]), false);
      version2.professionalAnswers[i] = `Elección estratégica profesional número ${i + 1} válida`;
      assert.strictEqual(isValidNarrative(version2.professionalAnswers[i]), true);

      prog2 = calculateDiamondProgress(version2);
      assert.strictEqual(prog2.decisionsProfessionalValid, i + 1);
      assert.strictEqual(prog2.facets, 5 + (i + 1));
    }

    // Version 2 now has 10 facets illuminated
    assert.strictEqual(prog2.facets, 10);
    // But explorations are still empty (0/3), so totalUnits is 10 and readyToClose is false
    assert.strictEqual(prog2.explorationsValid, 0);
    assert.strictEqual(prog2.totalUnits, 10);
    assert.strictEqual(prog2.readyToClose, false);

    // Confirm Version 1 was NEVER altered
    const prog1Check = calculateDiamondProgress(version1);
    assert.strictEqual(prog1Check.facets, 10);
    assert.strictEqual(prog1Check.totalUnits, 13);
    assert.strictEqual(prog1Check.isClosed, true);
  });
});
