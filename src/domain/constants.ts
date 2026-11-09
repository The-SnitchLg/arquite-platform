import { ContextKey, ThresholdRecord, InterventionRecord } from '../types/domain';

export const MIN_TEXT_CHARS = 10;

export function isValidNarrative(text?: string | null): boolean {
  return typeof text === 'string' && text.trim().length >= MIN_TEXT_CHARS;
}

export interface ExplorationMeta {
  key: ContextKey;
  title: string;
  question: string;
  guidance: string;
  iconName: string;
}

export const CANONICAL_EXPLORATIONS: ExplorationMeta[] = [
  {
    key: 'entorno',
    title: 'Entorno',
    question: '¿Qué hay a tu alrededor?',
    guidance: 'Identifica oportunidades, personas clave, restricciones, recursos y señales del contexto que influyen en tu realidad.',
    iconName: 'Compass'
  },
  {
    key: 'talentos',
    title: 'Talentos Singulares',
    question: '¿En qué eres distintivamente bueno?',
    guidance: 'Reconoce las fortalezas, habilidades naturales y aprendizajes acumulados que te distinguen y aportan valor único.',
    iconName: 'Sparkles'
  },
  {
    key: 'posibilidades',
    title: 'Posibilidades Estratégicas',
    question: '¿Qué puedes hacer?',
    guidance: 'Traza alternativas y caminos viables que podrías explorar y activar a partir de la conjunción de tus talentos y tu contexto.',
    iconName: 'Lightbulb'
  }
];

export const CANONICAL_PROF_EXPLORATIONS: ExplorationMeta[] = [
  {
    key: 'entorno',
    title: 'Entorno Profesional & Sectorial',
    question: '¿Qué dinámicas y demandas condicionan tu contexto profesional?',
    guidance: 'Analiza el mercado, las transformaciones de tu sector, las expectativas de los grupos de interés clave y las restricciones que delimitan tu campo de acción.',
    iconName: 'Compass'
  },
  {
    key: 'talentos',
    title: 'Talentos Singulares de Liderazgo',
    question: '¿Cuáles son tus ventajas comparativas y fortalezas distintivas?',
    guidance: 'Identifica las capacidades gerenciales, conocimientos de vanguardia y atributos de influencia que te diferencian y potencian tu efectividad.',
    iconName: 'Sparkles'
  },
  {
    key: 'posibilidades',
    title: 'Posibilidades Estratégicas Futuras',
    question: '¿Qué horizontes de oportunidad y desarrollo puedes desbloquear?',
    guidance: 'Delinea las opciones estratégicas de mayor impacto, nuevas iniciativas o transformaciones viables que puedes liderar a partir de tus ventajas.',
    iconName: 'Lightbulb'
  }
];

export interface StageChoiceMeta {
  index: number; // 0..4
  title: string;
  subtitle: string;
  coreQuestion: string;
  helpText: string;
  promptQuestion: string;
}

export const CANONICAL_STAGES: StageChoiceMeta[] = [
  {
    index: 0,
    title: 'Aspiración ganadora',
    subtitle: 'El propósito rector y la definición de éxito',
    coreQuestion: '¿Qué significa ganar para ti en esta dimensión y cómo reconocerás que lo lograste?',
    helpText: 'Define un resultado valioso, concreto y reconocible; no simplemente un deseo general o una aspiración difusa.',
    promptQuestion: '¿Puedes explicar qué resultado específico buscas y qué señales tangibles te permitirán identificar que lo alcanzaste?'
  },
  {
    index: 1,
    title: 'Dónde jugar',
    subtitle: 'El terreno de juego y las renuncias conscientes',
    coreQuestion: '¿En qué ámbitos concentrarás tu energía y en cuáles decidirás conscientemente no participar?',
    helpText: 'Escoge contextos, relaciones y prioridades concretas. Toda estrategia sólida exige renuncias deliberadas para no dispersar esfuerzos.',
    promptQuestion: '¿Qué priorizarás con determinación y a qué alternativas o distracciones renunciarás explícitamente para mantener el foco?'
  },
  {
    index: 2,
    title: 'Cómo ganar',
    subtitle: 'La ventaja distintiva y el enfoque singular',
    coreQuestion: '¿Cómo conseguirás resultados valiosos y diferenciales dentro de los ámbitos que elegiste?',
    helpText: 'Describe tu enfoque distintivo y por qué puede funcionar mejor que las alternativas convencionales para materializar tu aspiración.',
    promptQuestion: '¿Tu forma de actuar es verdaderamente específica para el contexto elegido o podría aplicarse indistintamente a cualquier situación?'
  },
  {
    index: 3,
    title: 'Con qué capacidades',
    subtitle: 'Las fortalezas críticas que sustentan la ventaja',
    coreQuestion: '¿Qué capacidades fundamentales deben existir y operar para que tu forma de ganar sea posible?',
    helpText: 'Identifica pocas fortalezas críticas interconectadas: cuáles ya posees sólidamente y cuáles necesitas construir o robustecer.',
    promptQuestion: '¿Cada capacidad descrita está directamente conectada con tu forma de ganar, o se trata de competencias genéricas?'
  },
  {
    index: 4,
    title: 'Sistemas de gestión',
    subtitle: 'Las rutinas, métricas y mecanismos de gobierno',
    coreQuestion: '¿Qué sistemas, rutinas y mediciones permitirán mantener tus capacidades y ejecutar tus elecciones?',
    helpText: 'Define mecanismos de revisión, recursos asignados, ritmos de retroalimentación e indicadores para ajustar el rumbo con base en evidencia.',
    promptQuestion: '¿Qué revisarás periódicamente, con qué cadencia y cómo calibrarás tus decisiones cuando surja nueva evidencia?'
  }
];

export interface ThresholdCatalogMeta {
  key: string; // 'U01'..'U07'
  number: number;
  romanNumeral: string;
  band: 'Funcional' | 'Identitaria' | 'Trascendente';
  title: string;
  fromState: string;
  toState: string;
  definition: string;
  startingPoint: string;
  destinationPoint: string;
  quote: string;
}

export const CANONICAL_THRESHOLDS: ThresholdCatalogMeta[] = [
  // Franja 1 · Funcional (2)
  {
    key: 'U01',
    number: 1,
    romanNumeral: 'I',
    band: 'Funcional',
    title: 'De la competencia a la consciencia',
    fromState: 'Competencia técnica',
    toState: 'Consciencia de propósito',
    definition: 'Pasar de hacer bien las cosas de manera automática a preguntarte por qué las haces y qué sentido y trascendencia tienen.',
    startingPoint: 'Ejecución impecable pero reactiva, sin cuestionar el para qué de las demandas externas.',
    destinationPoint: 'Actuación lúcida con criterio propio, evaluando el impacto y significado de cada esfuerzo.',
    quote: 'La maestría no consiste solo en dominar la técnica, sino en saber cuándo y por qué aplicarla.'
  },
  {
    key: 'U02',
    number: 2,
    romanNumeral: 'II',
    band: 'Funcional',
    title: 'Del hacer al pensar arquitectónicamente',
    fromState: 'Ejecución de tareas',
    toState: 'Diseño de sistemas',
    definition: 'Pasar de resolver urgencias puntuales y acumular tareas a diseñar los sistemas, estructuras y relaciones que sostienen resultados duraderos.',
    startingPoint: 'Sobrecarga operativa resolviendo síntomas inmediatos uno a uno.',
    destinationPoint: 'Construcción de arquitecturas, acuerdos y procesos que previenen la fricción y multiplican capacidades.',
    quote: 'El líder no se mide por las horas que apaga incendios, sino por las estructuras que hacen innecesario el fuego.'
  },
  // Franja 2 · Identitaria (3)
  {
    key: 'U03',
    number: 3,
    romanNumeral: 'III',
    band: 'Identitaria',
    title: 'Del control a la influencia',
    fromState: 'Supervisión directa',
    toState: 'Habilitación de autonomía',
    definition: 'Sustituir el control directo y la microgestión por la creación de condiciones contextuales que habiliten autonomía, alineación e influencia real.',
    startingPoint: 'Dependencia absoluta de tu supervisión y aprobación para que las cosas avancen.',
    destinationPoint: 'Gobernanza por principios compartidos, confianza mutua y empoderamiento de otros.',
    quote: 'Soltar la certidumbre técnica para dar espacio fecundo a la autoría y el talento ajeno.'
  },
  {
    key: 'U04',
    number: 4,
    romanNumeral: 'IV',
    band: 'Identitaria',
    title: 'De la identidad profesional a la estratégica',
    fromState: 'Especialista de oficio',
    toState: 'Arquitecto estratégico',
    definition: 'Explorar cómo evoluciona la forma en la que defines tu propia contribución: de experto ejecutor a catalizador de valor y dirección sistémica.',
    startingPoint: 'Identidad anclada en resolver tú mismo los problemas técnicos más difíciles.',
    destinationPoint: 'Identidad centrada en abrir horizontes, conectar posibilidades y orientar decisiones complejas.',
    quote: 'Tu mayor valor deja de ser lo que tú sabes hacer para convertirse en lo que haces posible en los demás.'
  },
  {
    key: 'U05',
    number: 5,
    romanNumeral: 'V',
    band: 'Identitaria',
    title: 'De la validación externa a la autoridad interna',
    fromState: 'Búsqueda de aprobación',
    toState: 'Criterio y serenidad',
    definition: 'Examinar la toma de decisiones difíciles desde la convicción y el criterio propio, superando la necesidad permanente de aprobación o consenso externo.',
    startingPoint: 'Postergación de decisiones incómodas por temor a defraudar expectativas ajenas.',
    destinationPoint: 'Autoridad interna arraigada, capaz de sostener la tensión y defender rumbos difíciles pero necesarios.',
    quote: 'La verdadera autoridad no se concede desde fuera; se forja en la coherencia entre lo que piensas, decides y sostienes.'
  },
  // Franja 3 · Trascendente (2)
  {
    key: 'U06',
    number: 6,
    romanNumeral: 'VI',
    band: 'Trascendente',
    title: 'De la gestión del presente a la creación de futuro',
    fromState: 'Prisionero del presente',
    toState: 'Anticipación y diseño',
    definition: 'Transitar de resolver lo inmediato e inercial a sembrar proactivamente escenarios, innovaciones y capacidades que madurarán en el futuro.',
    startingPoint: 'Agenda consumida íntegramente por los requerimientos del trimestre en curso.',
    destinationPoint: 'Espacio protegido para la reflexión prospectiva, la exploración de tendencias y la siembra a largo plazo.',
    quote: 'El futuro no se adivina: se diseña y se comienza a habitar con las decisiones de hoy.'
  },
  {
    key: 'U07',
    number: 7,
    romanNumeral: 'VII',
    band: 'Trascendente',
    title: 'Del logro individual al legado sistémico',
    fromState: 'Triunfo personal',
    toState: 'Trascendencia colectiva',
    definition: 'Reflexionar sobre qué capacidades, instituciones, procesos y cultura perdurarán positivamente en la comunidad más allá de tu presencia.',
    startingPoint: 'Búsqueda de reconocimiento y mérito individual en cada logro alcanzado.',
    destinationPoint: 'Construcción generosa de legado, formando a las próximas generaciones de líderes y elevando el entorno.',
    quote: 'La huella de un arquitecto estratégico se reconoce en la solidez de las obras que se sostienen sin él.'
  }
];

export function createInitialThresholds(): ThresholdRecord[] {
  return CANONICAL_THRESHOLDS.map(t => ({
    key: t.key,
    status: 'sin_iniciar',
    reflection: '',
    evidence: '',
    updatedAt: new Date().toISOString(),
    history: []
  }));
}

export function createInitialInterventions(): InterventionRecord[] {
  const kinds: ('cognitivo' | 'emocional' | 'simbólico' | 'estratégico')[] = [
    'cognitivo',
    'estratégico',
    'emocional',
    'estratégico',
    'simbólico',
    'estratégico',
    'simbólico'
  ];
  return CANONICAL_THRESHOLDS.map((t, i) => ({
    key: `I0${i + 1}`,
    thresholdKey: t.key,
    kind: kinds[i],
    actionText: '',
    evidenceText: '',
    updatedAt: new Date().toISOString()
  }));
}
