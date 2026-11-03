import React, { useState } from 'react';
import { JourneyData, InterventionKind } from '../../types/domain';
import { CANONICAL_THRESHOLDS, isValidNarrative } from '../../domain/constants';
import { calculateInterventionsProgress } from '../../domain/completeness';
import { repository } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface InterventionsViewProps {
  journey: JourneyData;
  onNavigateToThresholds: () => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({
  journey,
  onNavigateToThresholds
}) => {
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');
  const progress = calculateInterventionsProgress(journey.interventions);

  const handleUpdate = (key: string, kind: InterventionKind, action: string, evidence: string) => {
    setSaveStatus('Guardando...');
    repository.saveIntervention(key, kind, action, evidence);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-3xl sm:text-4xl text-ink">
              Ruta de Intervención
            </span>
            <Badge variant="mint">
              {progress.validCount} de 7 planes documentados
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Siete planes tácticos autónomos vinculados a cada umbral. Convierte reflexiones en compromisos específicos con tipo, acción y evidencia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onNavigateToThresholds}>
            Volver a Siete Umbrales
          </Button>
        </div>
      </div>

      {/* Grid of 7 Intervention Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CANONICAL_THRESHOLDS.map(tMeta => {
          const plan = journey.interventions.find(i => i.thresholdKey === tMeta.key) || {
            key: `I0${tMeta.number}`,
            thresholdKey: tMeta.key,
            kind: 'estratégico' as InterventionKind,
            actionText: '',
            evidenceText: '',
            updatedAt: new Date().toISOString()
          };

          const isComplete = Boolean(plan.kind) && isValidNarrative(plan.actionText) && isValidNarrative(plan.evidenceText);

          return (
            <Card key={tMeta.key} padding="lg" className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">
                    Plan para Umbral {tMeta.number} ({tMeta.romanNumeral})
                  </span>
                  <h3 className="text-base font-semibold text-ink mt-0.5">
                    {tMeta.title}
                  </h3>
                </div>
                <Badge variant={isComplete ? 'sage' : 'neutral'}>
                  {isComplete ? 'Documentado' : 'Pendiente'}
                </Badge>
              </div>

              {/* Typology Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Tipo de Intervención
                </label>
                <select
                  value={plan.kind}
                  onChange={e => handleUpdate(plan.key, e.target.value as InterventionKind, plan.actionText, plan.evidenceText)}
                  className="w-full p-2 rounded-lg border border-border-subtle bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary cursor-pointer"
                >
                  <option value="cognitivo">Cognitivo (Modelos mentales y marcos conceptuales)</option>
                  <option value="emocional">Emocional (Gestión de tensiones y presencia directiva)</option>
                  <option value="simbólico">Simbólico (Ritos, acuerdos visibles y lenguaje)</option>
                  <option value="estratégico">Estratégico (Sistemas, asignación de recursos y estructura)</option>
                </select>
              </div>

              {/* Action Description */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Acción Concreta a Desplegar
                </label>
                <textarea
                  rows={2}
                  value={plan.actionText}
                  onChange={e => handleUpdate(plan.key, plan.kind, e.target.value, plan.evidenceText)}
                  placeholder="¿Qué acción específica ejecutarás para activar esta transición? (mínimo 10 caracteres)..."
                  className="w-full p-2.5 rounded-lg border border-border-subtle bg-white text-ink text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary"
                />
              </div>

              {/* Expected Evidence */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Evidencia Tangible de Impacto
                </label>
                <input
                  type="text"
                  value={plan.evidenceText}
                  onChange={e => handleUpdate(plan.key, plan.kind, plan.actionText, e.target.value)}
                  placeholder="¿Cómo sabrás que la intervención funcionó?..."
                  className="w-full p-2 rounded-lg border border-border-subtle bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary"
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-right text-xs text-ink-muted">
        <span>{saveStatus}</span>
      </div>
    </div>
  );
};
