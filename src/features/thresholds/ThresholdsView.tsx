import React, { useState } from 'react';
import { JourneyData, ThresholdStatus } from '../../types/domain';
import { CANONICAL_THRESHOLDS } from '../../domain/constants';
import { calculateThresholdsProgress } from '../../domain/completeness';
import { repository } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  CheckCircle2, 
  History, 
  FileCheck 
} from 'lucide-react';

interface ThresholdsViewProps {
  journey: JourneyData;
  onNavigateToReports: () => void;
  onNavigateToInterventions: () => void;
}

export const ThresholdsView: React.FC<ThresholdsViewProps> = ({
  journey,
  onNavigateToReports,
  onNavigateToInterventions
}) => {
  const [selectedThresholdKey, setSelectedThresholdKey] = useState<string>('U01');
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');

  const progress = calculateThresholdsProgress(journey.thresholds);
  const isClosed = journey.closures.some(c => c.module === 'thresholds');

  const selectedMeta = CANONICAL_THRESHOLDS.find(t => t.key === selectedThresholdKey) || CANONICAL_THRESHOLDS[0];
  const selectedRecord = journey.thresholds.find(t => t.key === selectedThresholdKey) || journey.thresholds[0];

  const handleUpdate = (status: ThresholdStatus, reflection: string, evidence: string) => {
    setSaveStatus('Guardando...');
    repository.saveThreshold(selectedThresholdKey, status, reflection, evidence);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleConfirmClose = () => {
    const res = repository.closeThresholds();
    if (res.success) {
      setShowConfirmCloseModal(false);
    }
  };

  const getStatusBadge = (status: ThresholdStatus) => {
    switch (status) {
      case 'cambio_documentado':
        return <Badge variant="sage">Cambio Documentado</Badge>;
      case 'accion_experimentada':
        return <Badge variant="mint">Acción Experimentada</Badge>;
      case 'en_exploracion':
        return <Badge variant="terracotta">En Exploración</Badge>;
      default:
        return <Badge variant="neutral">Sin Iniciar</Badge>;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-3xl sm:text-4xl text-ink">Siete Umbrales</span>
            {isClosed ? (
              <Badge variant="sage">Edición Confirmada</Badge>
            ) : (
              <Badge variant="mint">En Proceso</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Mapa gerencial de transiciones de liderazgo en 3 dimensiones: Funcional, Identitaria y Trascendente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={onNavigateToInterventions}>
            Ver Planes de Intervención (7)
          </Button>

          {!isClosed && (
            <Button
              variant="primary"
              size="sm"
              disabled={!progress.readyToClose}
              onClick={() => setShowConfirmCloseModal(true)}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cerrar y confirmar edición ({progress.validCount}/7)</span>
            </Button>
          )}

          {isClosed && (
            <Button variant="outline" size="sm" onClick={onNavigateToReports}>
              Descargar Informe de Umbrales
            </Button>
          )}
        </div>
      </div>

      {/* Progress Strip */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
            Horizonte de Evolución de Liderazgo
          </span>
          <p className="text-lg font-semibold text-ink mt-0.5">
            {progress.validCount} de 7 umbrales recorridos con evidencia válida
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48 sm:w-64 bg-canvas-subtle h-2.5 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((progress.validCount / 7) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-primary">
            {Math.round((progress.validCount / 7) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Layout: 3 Bands of Thresholds (Left 7 Cols) and Active Detail Drawer (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3 Bands (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {(['Funcional', 'Identitaria', 'Trascendente'] as const).map(band => {
            const bandThresholds = CANONICAL_THRESHOLDS.filter(t => t.band === band);

            return (
              <div key={band} className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-border-subtle pb-1">
                  <h3 className="font-editorial text-xl text-ink font-normal">
                    Dimensión {band}
                  </h3>
                  <span className="text-xs text-ink-muted">
                    {bandThresholds.length} umbrales
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bandThresholds.map(meta => {
                    const rec = journey.thresholds.find(t => t.key === meta.key);
                    const isSelected = selectedThresholdKey === meta.key;

                    return (
                      <div
                        key={meta.key}
                        onClick={() => setSelectedThresholdKey(meta.key)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-white shadow-md ring-1 ring-primary/20'
                            : 'border-border-subtle bg-surface-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-editorial text-lg text-ink-muted">
                            {meta.romanNumeral}
                          </span>
                          {getStatusBadge(rec?.status || 'sin_iniciar')}
                        </div>

                        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary block">
                          {meta.fromState} → {meta.toState}
                        </span>
                        <h4 className="text-sm font-semibold text-ink mt-0.5">
                          {meta.title}
                        </h4>
                        <p className="text-xs text-ink-muted mt-2 line-clamp-2">
                          {rec?.reflection || meta.definition}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detail & Reflection Drawer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <Card padding="lg" className="space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Umbral {selectedMeta.number} ({selectedMeta.romanNumeral}) · {selectedMeta.band}
                </span>
                <h3 className="font-editorial text-2xl text-ink font-normal mt-0.5">
                  {selectedMeta.title}
                </h3>
              </div>
            </div>

            {/* Strategic Quote */}
            <div className="p-3 bg-canvas-subtle rounded-lg border-l-3 border-primary italic text-xs text-ink-muted">
              "{selectedMeta.quote}"
            </div>

            {/* Transition Definition */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-canvas-subtle rounded border border-border-subtle">
                <span className="font-semibold text-ink-muted block text-[10px] uppercase">Punto de Partida</span>
                <span className="text-ink">{selectedMeta.startingPoint}</span>
              </div>
              <div className="p-2 bg-teal-50 rounded border border-teal-100">
                <span className="font-semibold text-teal-800 block text-[10px] uppercase">Estado Conquistado</span>
                <span className="text-teal-900">{selectedMeta.destinationPoint}</span>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Estado Actual Seleccionado
              </label>
              <select
                value={selectedRecord.status}
                onChange={e => handleUpdate(e.target.value as ThresholdStatus, selectedRecord.reflection, selectedRecord.evidence)}
                className="w-full p-2.5 rounded-lg border border-border-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all cursor-pointer"
              >
                <option value="sin_iniciar">Sin Iniciar</option>
                <option value="en_exploracion">En Exploración</option>
                <option value="accion_experimentada">Acción Experimentada</option>
                <option value="cambio_documentado">Cambio Documentado</option>
              </select>
            </div>

            {/* Reflection Text Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Reflexión Personal del Umbral
              </label>
              <textarea
                rows={4}
                value={selectedRecord.reflection}
                onChange={e => handleUpdate(selectedRecord.status, e.target.value, selectedRecord.evidence)}
                placeholder="Describe cómo experimentas esta transición en tu práctica cotidiana (mínimo 10 caracteres)..."
                className="w-full p-3 rounded-lg border border-border-subtle bg-white text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all"
              />
            </div>

            {/* Evidence Text Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Evidencia Concreta Observada
              </label>
              <input
                type="text"
                value={selectedRecord.evidence}
                onChange={e => handleUpdate(selectedRecord.status, selectedRecord.reflection, e.target.value)}
                placeholder="Ej. Delegación de la toma de decisiones en el comité de dirección..."
                className="w-full p-2.5 rounded-lg border border-border-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-xs text-ink-muted">
              <span>{saveStatus}</span>
              <span>{selectedRecord.history.length} eventos históricos registrados</span>
            </div>

            {/* Real Change History (if available) */}
            {selectedRecord.history.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Historial de Modificaciones Reales</span>
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedRecord.history.map(evt => (
                    <div key={evt.id} className="p-2 bg-canvas-subtle rounded text-[11px] space-y-1 border border-border-subtle">
                      <div className="flex justify-between text-ink-muted">
                        <span>{new Date(evt.occurredAt).toLocaleString()}</span>
                        <span className="font-medium text-ink">{evt.newStatus}</span>
                      </div>
                      <p className="text-ink italic">"{evt.newReflection}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Closing Thresholds */}
      <Modal
        open={showConfirmCloseModal}
        onOpenChange={setShowConfirmCloseModal}
        title="Confirmar Edición de Siete Umbrales"
        description="Fijarás esta edición para generar el informe final 'Mapa de Evolución'."
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            Has completado los 7 umbrales con estado y evidencia. Al confirmar, se creará un snapshot inmutable para el informe descargable. Podrás continuar actualizando tus reflexiones en el futuro, conservando esta edición en tu historial.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <Button variant="ghost" onClick={() => setShowConfirmCloseModal(false)}>
              Revisar más tarde
            </Button>
            <Button variant="primary" onClick={handleConfirmClose} className="gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Confirmar y habilitar informe</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
