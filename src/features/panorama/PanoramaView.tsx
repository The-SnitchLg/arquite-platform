import React from 'react';
import { JourneyData, UserProfile } from '../../types/domain';
import { calculateGlobalProgress, calculateDiamondProgress } from '../../domain/completeness';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Sparkles, Sliders, FileText, ArrowRight } from 'lucide-react';
import { NavTab } from '../../components/layout/AppHeader';

interface PanoramaViewProps {
  user: UserProfile;
  journey: JourneyData;
  onNavigate: (tab: NavTab) => void;
}

export const PanoramaView: React.FC<PanoramaViewProps> = ({ user, journey, onNavigate }) => {
  // Determine active diamond (Slot B if exists, otherwise Slot A)
  const activeDiamond = journey.diamondSlotB || journey.diamondSlotA;
  const diamondProg = calculateDiamondProgress(activeDiamond);

  const closuresCount = {
    diamond: journey.closures.some(c => c.module === 'diamond'),
    thresholds: journey.closures.some(c => c.module === 'thresholds'),
    letters: journey.closures.some(c => c.module === 'letters'),
  };

  const progress = calculateGlobalProgress(
    activeDiamond,
    journey.thresholds,
    journey.interventions,
    journey.letters,
    closuresCount
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Hero */}
      <div className="bg-surface-white border border-border-subtle rounded-2xl p-6 sm:p-10 shadow-card">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-3">
            Recorrido Activo · ARQUITÉ
          </Badge>
          <h1 className="font-editorial text-3xl sm:text-5xl text-ink font-normal tracking-tight leading-tight">
            Bienvenido, {user.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-muted leading-relaxed font-sans">
            Este es tu espacio privado de arquitectura estratégica. Aquí construyes tus elecciones de liderazgo, registras evidencias de tus umbrales y redactas compromisos hacia tu futuro con total autonomía entre módulos.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('diamante')}
              className="gap-2"
            >
              <span>Continuar con Mi Diamante</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('informes')}
            >
              Consultar mis Informes
            </Button>
          </div>
        </div>
      </div>

      {/* Global Progress Strip (29 Units - Non-blocking) */}
      <div className="bg-canvas-subtle border border-border-subtle rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
              Indicador Global Informativo
            </span>
            <span className="text-xs text-ink-muted font-normal">
              (No condiciona las descargas independientes)
            </span>
          </div>
          <div className="text-lg font-semibold text-ink mt-0.5">
            {progress.totalUnits} de 29 campos completados · {progress.globalPct}%
          </div>
        </div>
        <div className="w-full md:w-64 bg-border-subtle h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progress.globalPct}%` }}
          />
        </div>
      </div>

      {/* Three Main Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Mi Diamante */}
        <Card padding="lg" hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant={diamondProg.isClosed ? 'sage' : diamondProg.readyToClose ? 'terracotta' : 'neutral'}>
                {diamondProg.isClosed
                  ? 'Confirmado y cerrado'
                  : diamondProg.readyToClose
                  ? '13/13 Listo para cierre'
                  : `${diamondProg.totalUnits}/13 En curso`}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-2">
              Mi Diamante
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              Diez elecciones estratégicas de Playing to Win y tres exploraciones del entorno, talentos y posibilidades.
            </p>

            <div className="space-y-2 py-3 border-y border-border-subtle text-xs text-ink">
              <div className="flex justify-between">
                <span className="text-ink-muted">Facetas activas:</span>
                <span className="font-semibold text-primary">{diamondProg.facets} de 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Requisitos estructurales:</span>
                <span className="font-semibold">{diamondProg.totalUnits} de 13</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Versión activa:</span>
                <span className="font-semibold">
                  {activeDiamond ? `v${activeDiamond.versionNumber} (${activeDiamond.status === 'closed' ? 'Fija' : 'Borrador'})` : 'Sin iniciar'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => onNavigate('diamante')}
              className="justify-between"
            >
              <span>Abrir Mi Diamante</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Module 2: Siete Umbrales */}
        <Card padding="lg" hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <Badge variant={progress.thresholdsIsClosed ? 'sage' : progress.thresholdsReadyToClose ? 'terracotta' : 'neutral'}>
                {progress.thresholdsIsClosed
                  ? 'Edición Confirmada'
                  : progress.thresholdsReadyToClose
                  ? '7/7 Listo para cierre'
                  : `${progress.thresholdsValid}/7 En exploración`}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-2">
              Siete Umbrales
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              Mapa gerencial de transiciones en 3 franjas (Funcional, Identitaria y Trascendente) con registro de evidencia.
            </p>

            <div className="space-y-2 py-3 border-y border-border-subtle text-xs text-ink">
              <div className="flex justify-between">
                <span className="text-ink-muted">Estaciones con evidencia:</span>
                <span className="font-semibold text-amber-700">{progress.thresholdsValid} de 7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Elegibilidad de informe:</span>
                <span className="font-semibold">
                  {progress.thresholdsReadyToClose || progress.thresholdsIsClosed ? 'Disponible' : 'Faltan evidencias'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Ruta de intervención:</span>
                <span className="font-semibold">{progress.interventionsValid} de 7 planes</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => onNavigate('umbrales')}
              className="justify-between"
            >
              <span>Explorar Umbrales</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Module 3: Cartas al Futuro */}
        <Card padding="lg" hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-secondary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant={progress.lettersIsClosed ? 'sage' : progress.lettersReadyToClose ? 'terracotta' : 'neutral'}>
                {progress.lettersIsClosed
                  ? 'Cartas Selladas'
                  : progress.lettersReadyToClose
                  ? '2/2 Listas para cierre'
                  : `${progress.lettersValid}/2 En redacción`}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-2">
              Cartas al Futuro
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              Compromisos epistolares íntimos en dimensión personal y profesional hacia tu yo de los próximos ciclos.
            </p>

            <div className="space-y-2 py-3 border-y border-border-subtle text-xs text-ink">
              <div className="flex justify-between">
                <span className="text-ink-muted">Carta Personal:</span>
                <span className="font-semibold">
                  {journey.letters.personal.body ? 'Redactada' : 'Pendiente'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Carta Profesional:</span>
                <span className="font-semibold">
                  {journey.letters.profesional.body ? 'Redactada' : 'Pendiente'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Informe final de cartas:</span>
                <span className="font-semibold">
                  {progress.lettersReadyToClose || progress.lettersIsClosed ? 'Disponible' : 'Requiere 2/2'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => onNavigate('cartas')}
              className="justify-between"
            >
              <span>Abrir Editor de Cartas</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
