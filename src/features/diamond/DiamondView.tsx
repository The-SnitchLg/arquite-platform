import React, { useState } from 'react';
import { JourneyData, Dimension, ContextKey } from '../../types/domain';
import { repository } from '../../lib/storage';
import { calculateDiamondProgress } from '../../domain/completeness';
import { CANONICAL_EXPLORATIONS, CANONICAL_STAGES, isValidNarrative } from '../../domain/constants';
import { DiamondSvg10 } from './DiamondSvg10';
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
import { DiamondComparisonView } from './DiamondComparisonView';

interface DiamondViewProps {
  journey: JourneyData;
  onNavigateToReports: () => void;
}

export const DiamondView: React.FC<DiamondViewProps> = ({ journey, onNavigateToReports }) => {
  // Determine available slots
  const slotA = journey.diamondSlotA;
  const slotB = journey.diamondSlotB;

  // Active view slot: defaults to B if exists, otherwise A
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>(() => {
    if (slotB && slotB.status === 'draft') return 'B';
    return slotB ? 'B' : 'A';
  });
  const [selectedDimension, setSelectedDimension] = useState<Dimension>('personal');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [showComparison, setShowComparison] = useState(false);
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalConsentChecked, setRenewalConsentChecked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');

  const currentVersion = activeSlot === 'B' ? (slotB || slotA) : slotA;
  const isReadOnly = currentVersion?.status === 'closed';
  const progress = calculateDiamondProgress(currentVersion);

  const bothClosed = slotA?.status === 'closed' && slotB?.status === 'closed';

  // Handlers for inputs with autosave simulation
  const handleContextChange = (key: ContextKey, val: string) => {
    if (isReadOnly) return;
    setSaveStatus('Guardando...');
    repository.saveDiamondContext(activeSlot, key, val);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleChoiceChange = (dim: Dimension, idx: number, val: string) => {
    if (isReadOnly) return;
    setSaveStatus('Guardando...');
    repository.saveDiamondChoice(activeSlot, dim, idx, val);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleSelectFacet = (dim: Dimension, idx: number) => {
    setSelectedDimension(dim);
    setSelectedStageIndex(idx);
  };

  const handleCreateSecondVersion = () => {
    const res = repository.createSecondVersion();
    if (res.success) {
      setActiveSlot('B');
    }
  };

  const handleConfirmClose = () => {
    const res = repository.closeDiamond(activeSlot);
    if (res.success) {
      setShowConfirmCloseModal(false);
    }
  };

  const handleExecuteRenewal = () => {
    if (!renewalConsentChecked) return;
    const idempotencyKey = `renew-${Date.now()}`;
    const res = repository.renewDiamondAtomic(idempotencyKey);
    if (res.success) {
      setShowRenewalModal(false);
      setRenewalConsentChecked(false);
      setActiveSlot('B');
    }
  };

  const handleCopyFromPrevious = (dim: Dimension, idx: number) => {
    if (isReadOnly || !slotA) return;
    const prevText = dim === 'personal' ? slotA.personalAnswers[idx] : slotA.professionalAnswers[idx];
    if (prevText) {
      handleChoiceChange(dim, idx, prevText);
    }
  };

  if (showComparison && slotA && slotB) {
    return (
      <DiamondComparisonView
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
            <span className="font-editorial text-3xl sm:text-4xl text-ink">Mi Diamante</span>
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
            Cascada de decisiones estratégicas personales y profesionales con 10 facetas interactivas y 3 exploraciones.
          </p>
        </div>

        {/* Slot Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Slot Switcher */}
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

          {/* Action: Create v2 if v1 closed and no v2 yet */}
          {slotA?.status === 'closed' && !slotB && (
            <Button variant="primary" size="sm" onClick={handleCreateSecondVersion}>
              <span>Crear mi actualización (v2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}

          {/* Action: Compare A/B if both closed */}
          {bothClosed && (
            <Button variant="outline" size="sm" onClick={() => setShowComparison(true)}>
              <span>Comparar A vs B</span>
            </Button>
          )}

          {/* Action: Initiate v3 Renewal if both closed */}
          {bothClosed && (
            <Button variant="secondary" size="sm" onClick={() => setShowRenewalModal(true)}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Iniciar nueva revisión</span>
            </Button>
          )}

          {/* Review and Close Button */}
          {!isReadOnly && (
            <Button
              variant="primary"
              size="sm"
              disabled={!progress.readyToClose}
              onClick={() => setShowConfirmCloseModal(true)}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Revisar y fijar versión ({progress.totalUnits}/13)</span>
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
                {progress.facets} de 10 facetas activas
              </span>
            </div>

            <DiamondSvg10
              version={currentVersion}
              selectedDimension={selectedDimension}
              selectedIndex={selectedStageIndex}
              onSelectFacet={handleSelectFacet}
              readOnly={isReadOnly}
            />

            <div className="w-full mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
              <span>{saveStatus}</span>
              <span className="font-medium text-ink">
                Requisitos: {progress.totalUnits} / 13
              </span>
            </div>
          </Card>

          {/* Notice on 10 facets vs 13 units */}
          {progress.facets === 10 && progress.totalUnits < 13 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> Las 10 facetas de decisiones están completas, pero para confirmar el diamante debes responder las 3 exploraciones del entorno ({progress.explorationsValid}/3).
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Three Explorations + Five Choices (7 Cols) */}
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
              Punto de partida contextual propio de esta versión. No se comparten con otras versiones temporales.
            </p>

            <div className="space-y-3">
              {CANONICAL_EXPLORATIONS.map(exp => {
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
                      placeholder="Escribe tu reflexión estratégica aquí (mínimo 10 caracteres)..."
                      className="w-full p-3 rounded-lg border border-border-subtle bg-white text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all disabled:bg-canvas-subtle disabled:cursor-not-allowed"
                    />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section B: The Ten Decisions (Playing to Win) */}
          <div className="space-y-4 pt-4 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-editorial text-2xl text-ink font-normal">
                  Las Cinco Elecciones Estratégicas
                </h2>
                <p className="text-xs text-ink-muted">
                  Selecciona la dimensión y responde cada una de las cinco decisiones interconectadas.
                </p>
              </div>

              {/* Dimension Switcher */}
              <div className="flex items-center bg-canvas-subtle p-1 rounded-lg border border-border-subtle">
                <button
                  onClick={() => setSelectedDimension('personal')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedDimension === 'personal'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Dimensión Personal ({progress.decisionsPersonalValid}/5)
                </button>
                <button
                  onClick={() => setSelectedDimension('profesional')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedDimension === 'profesional'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Dimensión Profesional ({progress.decisionsProfessionalValid}/5)
                </button>
              </div>
            </div>

            {/* Stages Accordion List */}
            <div className="space-y-3">
              {CANONICAL_STAGES.map(stage => {
                const answer = selectedDimension === 'personal'
                  ? currentVersion?.personalAnswers?.[stage.index] || ''
                  : currentVersion?.professionalAnswers?.[stage.index] || '';
                const isComplete = isValidNarrative(answer);
                const isSelected = selectedStageIndex === stage.index;

                return (
                  <div
                    key={`${selectedDimension}-${stage.index}`}
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

                        {/* Copy from slot A button if viewing Slot B */}
                        {activeSlot === 'B' && !isReadOnly && slotA && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopyFromPrevious(selectedDimension, stage.index)}
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
                          onChange={e => handleChoiceChange(selectedDimension, stage.index, e.target.value)}
                          placeholder="Formula tu elección estratégica con claridad y detalle (mínimo 10 caracteres)..."
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

      {/* Modal 1: Review and Confirm Immutable Closure (13/13) */}
      <Modal
        open={showConfirmCloseModal}
        onOpenChange={setShowConfirmCloseModal}
        title={`Revisar y Confirmar Diamante (v${currentVersion?.versionNumber})`}
        description="Esta confirmación es irreversible y fija el diamante como snapshot inmutable para futuras comparaciones."
        maxWidth="2xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-2">
            <p className="font-semibold text-sm">
              Has completado las 10 decisiones y las 3 exploraciones de esta versión (13/13).
            </p>
            <p>
              Al confirmar, esta versión quedará sellada en modo de <strong>solo lectura</strong> con fecha oficial y autor. Posteriormente podrás descargar su informe editorial y habilitar la creación de una versión posterior.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Resumen de Respuestas a Confirmar
            </h4>
            <div className="p-3 bg-canvas-subtle rounded-lg text-xs space-y-2 border border-border-subtle">
              <p className="font-semibold text-primary">3 Exploraciones:</p>
              {CANONICAL_EXPLORATIONS.map(exp => (
                <div key={exp.key} className="pl-2 border-l-2 border-primary/40">
                  <span className="font-medium text-ink">{exp.title}: </span>
                  <span className="text-ink-muted italic">"{currentVersion?.contexts[exp.key]}"</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-canvas-subtle rounded-lg text-xs space-y-2 border border-border-subtle">
              <p className="font-semibold text-primary">10 Decisiones Estratégicas:</p>
              {CANONICAL_STAGES.map(st => (
                <div key={st.index} className="pl-2 border-l-2 border-primary/40 space-y-1">
                  <span className="font-medium text-ink">{st.title}:</span>
                  <p className="text-ink-muted">Personal: "{currentVersion?.personalAnswers[st.index]}"</p>
                  <p className="text-ink-muted">Profesional: "{currentVersion?.professionalAnswers[st.index]}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button variant="ghost" onClick={() => setShowConfirmCloseModal(false)}>
              Volver a editar
            </Button>
            <Button variant="primary" onClick={handleConfirmClose} className="gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Confirmar y fijar versión definitivamente</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Replacement Consent Dialog (v1 -> v2, v3 New) */}
      <Modal
        open={showRenewalModal}
        onOpenChange={setShowRenewalModal}
        title="Revisar reemplazo de la versión anterior"
        description="Sustitución atómica e irreversible para iniciar un nuevo ciclo de revisión."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-secondary">
              <ShieldAlert className="w-4 h-4" />
              <span>Aviso de Sustitución Consentida</span>
            </div>
            <p>
              Tienes dos versiones cerradas: <strong>Versión 1 ({slotA?.closedAt ? new Date(slotA.closedAt).toLocaleDateString() : 'Anterior'})</strong> y <strong>Versión 2 ({slotB?.closedAt ? new Date(slotB.closedAt).toLocaleDateString() : 'Reciente'})</strong>.
            </p>
            <p>
              Para iniciar un nuevo ciclo, la versión más antigua (v1) dejará de estar disponible en el comparador activo. La versión reciente (v2) pasará a ser tu nueva referencia (Slot A), y comenzará una nueva versión editable (Slot B).
            </p>
            <p className="text-ink font-medium">
              Te recomendamos descargar el informe de tu versión antigua antes de continuar si deseas conservar una copia documental.
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={renewalConsentChecked}
                onChange={e => setRenewalConsentChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-mint"
              />
              <span className="text-xs text-ink leading-relaxed">
                Comprendo qué versión se sustituirá y autorizo expresamente la rotación atómica para iniciar la nueva versión 3.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <Button variant="ghost" onClick={() => setShowRenewalModal(false)}>
              Conservar mis dos versiones
            </Button>
            <Button
              variant="secondary"
              disabled={!renewalConsentChecked}
              onClick={handleExecuteRenewal}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sustituir versión antigua e iniciar nueva</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
