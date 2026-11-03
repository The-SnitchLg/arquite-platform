import { UserProfile, JourneyData } from '../types/domain';
import { createInitialThresholds, createInitialInterventions } from '../domain/constants';

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  email: 'larrygomezg@gmail.com',
  name: 'Larry Gómez',
  role: 'admin',
  createdAt: '2026-11-01T10:00:00.000Z'
};

export const DEMO_PARTICIPANT: UserProfile = {
  id: 'usr-part-01',
  email: 'director@estudioarquite.com',
  name: 'Elena Morales (Directora Ejecutiva)',
  role: 'participant',
  createdAt: '2026-11-02T09:30:00.000Z'
};

export function createEmptyJourney(user: UserProfile): JourneyData {
  return {
    id: `jrn-${user.id}`,
    ownerId: user.id,
    ownerEmail: user.email,
    ownerName: user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    diamondSlotA: {
      id: `dia-${user.id}-v1`,
      journeyId: `jrn-${user.id}`,
      versionNumber: 1,
      slot: 'A',
      status: 'draft',
      startedAt: new Date().toISOString(),
      contexts: {
        entorno: '',
        talentos: '',
        posibilidades: ''
      },
      personalAnswers: ['', '', '', '', ''],
      professionalAnswers: ['', '', '', '', ''],
      revision: 1
    },
    diamondSlotB: null,
    thresholds: createInitialThresholds(),
    interventions: createInitialInterventions(),
    letters: {
      personal: {
        dimension: 'personal',
        body: '',
        updatedAt: new Date().toISOString(),
        isSealed: false
      },
      profesional: {
        dimension: 'profesional',
        body: '',
        updatedAt: new Date().toISOString(),
        isSealed: false
      }
    },
    closures: []
  };
}

export function createSampleJourneyForAdminDemo(): JourneyData {
  const journey = createEmptyJourney(DEMO_PARTICIPANT);
  
  // Set Diamond Slot A as closed (v1)
  journey.diamondSlotA = {
    id: 'dia-part-v1',
    journeyId: journey.id,
    versionNumber: 1,
    slot: 'A',
    status: 'closed',
    startedAt: '2026-10-15T08:00:00.000Z',
    closedAt: '2026-10-28T18:45:00.000Z',
    confirmedBy: DEMO_PARTICIPANT.id,
    contexts: {
      entorno: 'Entorno de alta exigencia estratégica con expansión acelerada de equipos interdisciplinarios y necesidad de gobernanza clara.',
      talentos: 'Capacidad analítica para descomponer sistemas complejos, articular visiones compartidas y crear entornos de confianza.',
      posibilidades: 'Transitar de la consultoría reactiva a la dirección de plataformas de desarrollo de liderazgo e innovación estratégica.'
    },
    personalAnswers: [
      'Ganar significa vivir con congruencia profunda, paz mental y presencia de calidad para mi familia y proyectos vitales.',
      'Decido concentrarme en proyectos de impacto cualitativo duradero y renunciar a compromisos que fragmenten mi atención.',
      'Cultivando hábitos rigurosos de desconexión nocturna y priorizando diálogos honestos con mis seres queridos.',
      'Claridad en valores no negociables, gestión emocional ante la incertidumbre y disciplina diaria de reflexión.',
      'Revisión semanal de agenda los domingos y un espacio mensual de retiro de silencio para calibrar decisiones.'
    ],
    professionalAnswers: [
      'Posicionar a mi organización como el referente indiscutible de pensamiento estratégico y arquitectura de liderazgo en la región.',
      'Enfoque en alta dirección y organizaciones con propósito; rechazar contratos masivos sin compromiso genuino de transformación.',
      'Metodologías de arquitectura estratégica integrales y acompañamiento personalizado de máxima excelencia editorial.',
      'Profundidad conceptual en teoría de decisiones, diseño de experiencias ejecutivas y rigor metodológico.',
      'Comité trimestral de balance estratégico y tablero de impacto con indicadores cualitativos y de sostenibilidad.'
    ],
    revision: 3
  };

  // Set Diamond Slot B as draft (v2 in progress)
  journey.diamondSlotB = {
    id: 'dia-part-v2',
    journeyId: journey.id,
    versionNumber: 2,
    slot: 'B',
    status: 'draft',
    startedAt: '2026-11-01T10:00:00.000Z',
    contexts: {
      entorno: 'Consolidación de alianzas internacionales y necesidad de delegar la operación diaria en liderazgos emergentes.',
      talentos: 'Síntesis directiva, mentoría de talentos de alto potencial y diseño de modelos de impacto a escala.',
      posibilidades: 'Publicación de marcos metodológicos abiertos y creación de un consejo asesor consultivo.'
    },
    personalAnswers: [
      'Vivir con mayor holgura temporal y serenidad, asegurando espacio para la creación intelectual profunda.',
      'Preservar mañanas libres de reuniones y limitar los viajes de trabajo a dos por semestre.',
      'Estableciendo fronteras infranqueables y delegando la toma de decisiones secundarias.',
      'Autoridad interna para decir no a ofertas lucrativas pero incompatibles con mi bienestar.',
      'Bitácora de energía semanal y chequeo trimestral con mentor de vida.'
    ],
    professionalAnswers: [
      'Construir un estudio directivo autosuficiente que opere con excelencia institucional.',
      'Asesoría a consejos de administración y juntas directivas de empresas de impacto.',
      '',
      '',
      ''
    ],
    revision: 2
  };

  // Add closure for Diamond v1
  journey.closures.push({
    id: 'cls-dia-v1',
    journeyId: journey.id,
    module: 'diamond',
    editionNo: 1,
    diamondVersionId: 'dia-part-v1',
    closedAt: '2026-10-28T18:45:00.000Z',
    confirmedBy: DEMO_PARTICIPANT.id,
    snapshot: journey.diamondSlotA,
    snapshotHash: 'hash-dia-v1-verified'
  });

  // Populate sample thresholds
  journey.thresholds[0].status = 'cambio_documentado';
  journey.thresholds[0].reflection = 'He dejado de medir mi valor por la cantidad de entregables técnicos y ahora priorizo el entendimiento del impacto sistémico.';
  journey.thresholds[0].evidence = 'Reunión de alineación donde redefinimos los criterios de éxito de todo el departamento.';

  journey.thresholds[1].status = 'accion_experimentada';
  journey.thresholds[1].reflection = 'Diseñé una matriz de gobernanza que resolvió cuellos de botella recurrentes en la toma de decisiones.';
  journey.thresholds[1].evidence = 'Documento de arquitectura de decisiones implementado en el equipo.';

  journey.thresholds[2].status = 'en_exploracion';
  journey.thresholds[2].reflection = 'Transitando de la supervisión minuciosa a la delegación con marcos de autonomía claros.';
  journey.thresholds[2].evidence = 'Primer proyecto entregado con supervisión quincenal en lugar de diaria.';

  return journey;
}
