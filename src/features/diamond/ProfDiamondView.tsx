import React, { useState } from 'react';
import { JourneyData, ContextKey } from '../../types/domain';
import { repository } from '../../lib/storage';
import { calculateProfDiamondProgress } from '../../domain/completeness';
import { CANONICAL_PROF_EXPLORATIONS, CANONICAL_STAGES, isValidNarrative } from '../../domain/constants';
import { DiamondSvg5 } from './DiamondSvg5';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  FileCheck,
  ChevronDown,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ProfDiamondComparisonView } from './ProfDiamondComparisonView';

interface ProfDiamondViewProps {
  journey: JourneyData;
  onNavigateToReports: () => void;
}

export const ProfDiamondView: React.FC<ProfDiamondViewProps> = ({ journey, onNavigateToReports }) => {
  const slotA = journey.profDiamondSlotA;
  const slotB = journey.profDiamondSlotB;

  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>(() => {
    if (slotB && slotB.status === 'draft') return 'B';
    return slotB ? 'B' : 'A';
  });
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [showComparison, setShowComparison] = useState(false);
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalConsentChecked, setRenewalConsentChecked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');

  const currentVersion = activeSlot === 'B' ? (slotB || slotA) : slotA;
  const isReadOnly = currentVersion?.status === 'closed';
  const progress = calculateProfDiamondProgress(currentVersion);

  const bothClosed = slotA?.status === 'closed' && slotB?.status === 'closed';

  const handleContextChange = (key: ContextKey, val: string) => {
    if (isReadOnly) return;
    setSaveStatus('Guardando...');
    repository.saveProfDiamondContext(activeSlot, key, val);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleChoiceChange = (idx: number, val: string) => {
    if (isReadOnly) return;
    setSaveStatus('Guardando...');
    repository.saveProfDiamondChoice(activeSlot, idx, val);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleSelectFacet = (idx: number) => {
    setSelectedStageIndex(idx);
  };

  const handleCreateSecondVersion = () => {
    const res = repository.createSecondProfDiamondVersion();
    if (res.success) {
      setActiveSlot('B');
    }
  };

  const handleConfirmClose = () => {
    const res = repository.closeProfDiamond(activeSlot);
    if (res.success) {
      setShowConfirmCloseModal(false);
    }
  };

  const handleExecuteRenewal = () => {
    if (!renewalConsentChecked) return;
    const idempotencyKey = `renew-pro-${Date.now()}`;
    const res = repository.renewProfDiamondAtomic(idempotencyKey);
    if (res.success) {
      setShowRenewalModal(false);
      setRenewalConsentChecked(false);
      setActiveSlot('B');
    }
  };

  const handleCopyFromPrevious = (idx: number) => {
    if (isReadOnly || !slotA) return;
    const prevText = slotA.professionalAnswers[idx];
    if (prevText) {
      handleChoiceChange(idx, prevText);
    }
  };

  if (showComparison && slotA && slotB) {
    return (
      <ProfDiamondComparisonView
        versionA={slotA}
        versionB={slotB}
        onBack={() => setShowComparison(false)}
        onRequestRenewal={() => setShowRenewalModal(true)}
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Slot Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-3xl sm:text-4xl text-ink">Mi Diamante Profesional</span>
            {isReadOnly ? (
              <Badge variant="sage" className="gap-1">
                <Lock className="w-3 h-3" />
                <span>Solo lectura (Confirmado)</span>
              </Badge>
            ) : (
              <Badge variant="mint" className="gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Borrador en construcción</span>
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Cascada de decisiones estratégicas profesionales con 5 facetas interactivas y 3 exploraciones del entorno (8 unidades requeridas).
          </p>
        </div>

        {/* Slot Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-surface-white p-1 rounded-lg border border-border-subtle shadow-xs">
            <button
              onClick={() => setActiveSlot('A')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeSlot === 'A' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {slotA ? `Versión 1 ${slotA.status === 'closed' ? '(Fija)' : '(Borrador)'}` : 'Versión 1'}
            </button>
            {slotB && (
              <button
                onClick={() => setActiveSlot('B')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                  activeSlot === 'B' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {`Versión ${slotB.versionNumber} ${slotB.status === 'closed' ? '(Fija)' : '(Borrador)'}`}
              </button>
            )}
          </div>

          {slotA?.status === 'closed' && !slotB && (
            <Button variant="primary" size="sm" onClick={handleCreateSecondVersion}>
              <span>Crear mi actualización (v2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}

          {bothClosed && (
            <Button variant="outline" size="sm" onClick={() => setShowComparison(true)}>
              <span>Comparar A vs B</span>
            </Button>
          )}

          {bothClosed && (
            <Button variant="secondary" size="sm" onClick={() => setShowRenewalModal(true)}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Iniciar nueva revisión</span>
            </Button>
          )}

          {!isReadOnly && (
            <Button
              variant="primary"
              size="sm"
              disabled={!progress.readyToClose}
              onClick={() => setShowConfirmCloseModal(true)}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Revisar y fijar versión ({progress.totalUnits}/8)</span>
            </Button>
          )}

          {isReadOnly && (
            <Button variant="outline" size="sm" onClick={onNavigateToReports}>
              Descargar Informe v{currentVersion?.versionNumber}
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Visual SVG (Left) and Interactive Choices (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Diamond SVG & Progress Metrics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <Card padding="md" className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-border-subtle">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Visualizador de Facetas
              </span>
              <span className="text-xs font-semibold text-primary">
                {progress.facets} de 5 facetas activas
              </span>
            </div>

            <DiamondSvg5
              version={currentVersion}
              selectedIndex={selectedStageIndex}
              onSelectFacet={handleSelectFacet}
              readOnly={isReadOnly}
            />

            <div className="w-full mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
              <span>{saveStatus}</span>
              <span className="font-medium text-ink">
                Requisitos: {progress.totalUnits} / 8
              </span>
            </div>
          </Card>

          {progress.facets === 5 && progress.totalUnits < 8 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> Las 5 facetas de decisiones profesionales están completas, pero para confirmar el diamante debes responder las 3 exploraciones del entorno ({progress.explorationsValid}/3).
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Three Explorations + Five Decisions (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section A: The Three Explorations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl text-ink font-normal">
                Las Tres Exploraciones del Entorno
              </h2>
              <span className="text-xs font-semibold text-primary">
                {progress.explorationsValid} de 3 completadas
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Punto de partida contextual profesional propio de esta versión.
            </p>

            <div className="space-y-3">
              {CANONICAL_PROF_EXPLORATIONS.map(exp => {
                const val = currentVersion?.contexts?.[exp.key] || '';
                const isComplete = isValidNarrative(val);

                return (
                  <Card key={exp.key} padding="md">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {exp.title}
                        </span>
                        <h3 className="text-sm font-semibold text-ink mt-0.5">
                          {exp.question}
                        </h3>
                      </div>
                      <Badge variant={isComplete ? 'sage' : 'neutral'}>
                        {isComplete ? 'Completada' : 'Pendiente'}
                      </Badge>
                    </div>

                    <p className="text-xs text-ink-muted mb-3">{exp.guidance}</p>

                    <textarea
                      rows={3}
                      disabled={isReadOnly}
                      value={val}
                      onChange={e => handleContextChange(exp.key, e.target.value)}
                      placeholder="Escribe tu reflexión estratégica profesional aquí (mínimo 10 caracteres)..."
                      className="w-full p-3 rounded-lg border border-border-subtle bg-white text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all disabled:bg-canvas-subtle disabled:cursor-not-allowed"
                    />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section B: The Five Professional Decisions */}
          <div className="space-y-4 pt-4 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-editorial text-2xl text-ink font-normal">
                  Las Cinco Elecciones Estratégicas Profesionales
                </h2>
                <p className="text-xs text-ink-muted">
                  Responde cada una de las cinco decisiones interconectadas en cascada.
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                {progress.decisionsProfessionalValid} de 5 decisiones completadas
              </span>
            </div>

            {/* Stages Accordion List */}
            <div className="space-y-3">
              {CANONICAL_STAGES.map(stage => {
                const answer = currentVersion?.professionalAnswers?.[stage.index] || '';
                const isComplete = isValidNarrative(answer);
                const isSelected = selectedStageIndex === stage.index;

                return (
                  <div
                    key={`prof-${stage.index}`}
                    className={`rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary shadow-sm bg-white'
                        : 'border-border-subtle bg-surface-white'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => setSelectedStageIndex(stage.index)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isComplete ? 'bg-primary text-white' : 'bg-canvas-subtle text-ink-muted'
                        }`}>
                          {stage.index + 1}
                        </span>
                        <div>
                          <span className="text-sm font-semibold text-ink block">
                            {stage.title}
                          </span>
                          <span className="text-xs text-ink-muted hidden sm:block">
                            {stage.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={isComplete ? 'sage' : 'neutral'}>
                          {isComplete ? 'Faceta Activa' : 'Pendiente'}
                        </Badge>
                        <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${
                          isSelected ? 'transform rotate-180' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Body */}
                    {isSelected && (
                      <div className="p-4 pt-0 border-t border-border-subtle space-y-3 bg-canvas-subtle/30 rounded-b-xl">
                        <div className="p-3 bg-white rounded-lg border border-border-subtle text-xs text-ink space-y-1">
                          <p className="font-semibold text-ink">{stage.coreQuestion}</p>
                          <p className="text-ink-muted">{stage.helpText}</p>
                        </div>

                        {activeSlot === 'B' && !isReadOnly && slotA && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopyFromPrevious(stage.index)}
                              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copiar respuesta de Versión 1</span>
                            </button>
                          </div>
                        )}

                        <textarea
                          rows={4}
                          disabled={isReadOnly}
                          value={answer}
                          onChange={e => handleChoiceChange(stage.index, e.target.value)}
                          placeholder="Formula tu elección estratégica profesional con claridad y rigor (mínimo 10 caracteres)..."
                          className="w-full p-3 rounded-lg border border-border-subtle bg-white text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all disabled:bg-canvas-subtle disabled:cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Review and Confirm Immutable Closure (8/8) */}
      <Modal
        open={showConfirmCloseModal}
        onOpenChange={setShowConfirmCloseModal}
        title={`Revisar y Confirmar Diamante Profesional (v${currentVersion?.versionNumber})`}
        description="Esta confirmación es irreversible y fija el Diamante Profesional como snapshot inmutable para futuras comparaciones."
        maxWidth="2xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-2">
            <p className="font-semibold text-sm">
              Has completado las 5 decisiones profesionales y las 3 exploraciones del entorno (8/8).
            </p>
            <p>
              Al confirmar, esta versión quedará sellada en modo de <strong>solo lectura</strong> con fecha oficial y autor. Posteriormente podrás descargar su informe editorial exclusivo y habilitar la creación de una versión posterior.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Resumen de contenido a sellar
            </h4>

            <div className="p-3 bg-surface-sand/40 rounded-lg border border-border-subtle text-xs space-y-2">
              <span className="font-semibold text-ink block">3 Exploraciones del Entorno:</span>
              <ul className="list-disc list-inside space-y-1 text-ink-muted pl-1">
                {CANONICAL_PROF_EXPLORATIONS.map(exp => (
                  <li key={exp.key} className="truncate">
                    <strong className="text-ink">{exp.title}:</strong> {currentVersion?.contexts?.[exp.key]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-surface-sand/40 rounded-lg border border-border-subtle text-xs space-y-2">
              <span className="font-semibold text-ink block">5 Elecciones Profesionales:</span>
              <ul className="list-disc list-inside space-y-1 text-ink-muted pl-1">
                {CANONICAL_STAGES.map(s => (
                  <li key={s.index} className="truncate">
                    <strong className="text-ink">{s.title}:</strong> {currentVersion?.professionalAnswers?.[s.index]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button variant="ghost" size="sm" onClick={() => setShowConfirmCloseModal(false)}>
            Seguir editando
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmClose} className="gap-2">
            <FileCheck className="w-4 h-4" />
            <span>Confirmar y Sellar Versión {currentVersion?.versionNumber}</span>
          </Button>
        </div>
      </Modal>

      {/* Modal 2: Consent-Based Renewal (A/B -> v3 Slot B) */}
      <Modal
        open={showRenewalModal}
        onOpenChange={setShowRenewalModal}
        title="Consentimiento Explícito de Renovación de Versiones"
        description="Iniciar un nuevo ciclo archivará la versión más antigua y preparará un nuevo borrador de trabajo."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold text-sm">¿Cómo funciona la renovación consentida?</p>
              <p>
                Actualmente dispones de la <strong>Versión {slotA?.versionNumber}</strong> (Slot A) y la <strong>Versión {slotB?.versionNumber}</strong> (Slot B), ambas fijadas y cerradas.
              </p>
              <p className="pt-1">
                Al aceptar, la <strong>Versión {slotB?.versionNumber}</strong> pasará a ocupar el <strong>Slot A</strong> como tu referencia previa inmutable, y se creará una nueva <strong>Versión {(slotB?.versionNumber || 2) + 1}</strong> en blanco en el <strong>Slot B</strong> para tus nuevas decisiones.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border-subtle bg-surface-white hover:bg-canvas-subtle cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={renewalConsentChecked}
              onChange={e => setRenewalConsentChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-mint border-border-subtle cursor-pointer"
            />
            <span className="text-xs text-ink leading-relaxed">
              Comprendo y autorizo la sustitución de la Versión {slotA?.versionNumber} en Slot A por la Versión {slotB?.versionNumber}, y la creación de una nueva versión borrador editable.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button variant="ghost" size="sm" onClick={() => setShowRenewalModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!renewalConsentChecked}
              onClick={handleExecuteRenewal}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ejecutar Renovación</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
