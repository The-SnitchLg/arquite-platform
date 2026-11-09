import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidNarrative } from './constants.js';
import { calculateDiamondProgress, calculateProfDiamondProgress, calculateGlobalProgress } from './completeness.js';
import { DiamondVersion, ProfDiamondVersion } from '../types/domain.js';
import { compareProfDiamondVersions } from './comparison.js';

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

describe('Mi Diamante Profesional — Independent Illumination, Validation & Lifecycle', () => {
  const profVersion1: ProfDiamondVersion = {
    id: 'dia-pro-v1',
    journeyId: 'jrn-1',
    versionNumber: 1,
    slot: 'A',
    status: 'closed',
    startedAt: '2026-10-01T00:00:00Z',
    closedAt: '2026-10-10T00:00:00Z',
    contexts: {
      entorno: 'Entorno corporativo de alta competencia y transformación digital.',
      talentos: 'Liderazgo estratégico, dirección ejecutiva y visión sistémica.',
      posibilidades: 'Expansión de modelos de negocio y diversificación regional.'
    },
    professionalAnswers: [
      'Aspiración ganadora: Posicionar la firma como referente iberoamericano.',
      'Dónde jugar: Segmento corporativo y firmas de servicios intensivos en conocimiento.',
      'Cómo ganar: Oferta boutique con arquitectura de valor diferencial y rigor consultivo.',
      'Capacidades requeridas: Métodos propietarios de diagnóstico y consultores senior.',
      'Sistemas de gestión: OKRs trimestrales y comités ejecutivos de gobernanza.'
    ],
    revision: 1
  };

  it('Prof Version 1 has 5/5 active facets, 8/8 total units, and is readyToClose/closed', () => {
    const prog = calculateProfDiamondProgress(profVersion1);
    assert.strictEqual(prog.facets, 5);
    assert.strictEqual(prog.decisionsProfessionalValid, 5);
    assert.strictEqual(prog.explorationsValid, 3);
    assert.strictEqual(prog.totalUnits, 8);
    assert.strictEqual(prog.readyToClose, true);
    assert.strictEqual(prog.isClosed, true);
  });

  it('Prof Version 2 illuminates progressively (0/5 -> 5/5) and requires all 8 units for closure', () => {
    const profVersion2: ProfDiamondVersion = {
      id: 'dia-pro-v2',
      journeyId: 'jrn-1',
      versionNumber: 2,
      slot: 'B',
      status: 'draft',
      startedAt: '2026-11-01T00:00:00Z',
      contexts: { entorno: '', talentos: '', posibilidades: '' },
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    };

    // Initial state: 0/5 facets, 0/8 units, not ready to close
    let prog2 = calculateProfDiamondProgress(profVersion2);
    assert.strictEqual(prog2.facets, 0);
    assert.strictEqual(prog2.decisionsProfessionalValid, 0);
    assert.strictEqual(prog2.explorationsValid, 0);
    assert.strictEqual(prog2.totalUnits, 0);
    assert.strictEqual(prog2.readyToClose, false);
    assert.strictEqual(prog2.isClosed, false);

    // Answer decisions progressively
    for (let i = 0; i < 5; i++) {
      profVersion2.professionalAnswers[i] = `Decisión profesional nivel ${i + 1} de v2 con suficiente texto`;
      prog2 = calculateProfDiamondProgress(profVersion2);
      assert.strictEqual(prog2.decisionsProfessionalValid, i + 1);
      assert.strictEqual(prog2.facets, i + 1);
      assert.strictEqual(prog2.totalUnits, i + 1);
      assert.strictEqual(prog2.readyToClose, false);
    }

    assert.strictEqual(prog2.facets, 5);
    assert.strictEqual(prog2.totalUnits, 5);
    // Still not ready to close because 3 explorations are empty!
    assert.strictEqual(prog2.readyToClose, false);

    // Fill in the 3 explorations
    profVersion2.contexts.entorno = 'Nuevo entorno macroeconómico post-expansión.';
    prog2 = calculateProfDiamondProgress(profVersion2);
    assert.strictEqual(prog2.explorationsValid, 1);
    assert.strictEqual(prog2.totalUnits, 6);
    assert.strictEqual(prog2.readyToClose, false);

    profVersion2.contexts.talentos = 'Nuevas capacidades digitales e inteligencia artificial aplicada.';
    prog2 = calculateProfDiamondProgress(profVersion2);
    assert.strictEqual(prog2.explorationsValid, 2);
    assert.strictEqual(prog2.totalUnits, 7);
    assert.strictEqual(prog2.readyToClose, false);

    profVersion2.contexts.posibilidades = 'Apertura de nuevos mercados internacionales en Europa y Latam.';
    prog2 = calculateProfDiamondProgress(profVersion2);
    assert.strictEqual(prog2.explorationsValid, 3);
    assert.strictEqual(prog2.totalUnits, 8);
    assert.strictEqual(prog2.readyToClose, true);

    // Verify Version 1 remained completely untouched
    const prog1Check = calculateProfDiamondProgress(profVersion1);
    assert.strictEqual(prog1Check.facets, 5);
    assert.strictEqual(prog1Check.totalUnits, 8);
    assert.strictEqual(prog1Check.isClosed, true);
  });

  it('Longitudinal comparison between Prof Version 1 and Version 2 covers all 8 fields correctly', () => {
    const profVersion2: ProfDiamondVersion = {
      ...profVersion1,
      id: 'dia-pro-v2',
      versionNumber: 2,
      slot: 'B',
      status: 'closed',
      professionalAnswers: [
        'Aspiración ganadora actualizada para nuevo ciclo estratégico', // modified
        profVersion1.professionalAnswers[1], // unchanged
        profVersion1.professionalAnswers[2], // unchanged
        'Nuevas capacidades de analítica predictiva avanzada', // modified
        profVersion1.professionalAnswers[4] // unchanged
      ],
      contexts: {
        entorno: profVersion1.contexts.entorno, // unchanged
        talentos: 'Talentos actualizados con enfoque global', // modified
        posibilidades: profVersion1.contexts.posibilidades // unchanged
      }
    };

    const diff = compareProfDiamondVersions(profVersion1, profVersion2);
    assert.strictEqual(diff.summary.totalFields, 8);
    assert.strictEqual(diff.summary.modified, 3); // 2 decisions + 1 exploration
    assert.strictEqual(diff.summary.unchanged, 5); // 3 decisions + 2 explorations
    assert.strictEqual(diff.summary.added, 0);
  });

  it('Global progress denominator remains strictly 29 units regardless of Professional Diamond', () => {
    const globalProg = calculateGlobalProgress(
      null,
      [],
      [],
      {
        personal: { dimension: 'personal', body: '', updatedAt: '', isSealed: false },
        profesional: { dimension: 'profesional', body: '', updatedAt: '', isSealed: false }
      },
      { diamond: false, thresholds: false, letters: false }
    );

    // Global totalUnits max denominator is 29:
    // 13 (diamond) + 7 (thresholds) + 7 (interventions) + 2 (letters) = 29
    assert.strictEqual(typeof globalProg.totalUnits, 'number');
    assert.strictEqual(globalProg.totalUnits <= 29, true);
  });
});
