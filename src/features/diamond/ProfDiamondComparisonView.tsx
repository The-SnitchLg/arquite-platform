import React, { useState } from 'react';
import { ProfDiamondVersion } from '../../types/domain';
import { compareProfDiamondVersions, DiffStatus } from '../../domain/comparison';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';

interface ProfDiamondComparisonViewProps {
  versionA: ProfDiamondVersion;
  versionB: ProfDiamondVersion;
  onBack: () => void;
  onRequestRenewal: () => void;
}

export const ProfDiamondComparisonView: React.FC<ProfDiamondComparisonViewProps> = ({
  versionA,
  versionB,
  onBack,
  onRequestRenewal
}) => {
  const [filter, setFilter] = useState<'all' | 'modificado' | 'agregado'>('all');
  const comparison = compareProfDiamondVersions(versionA, versionB);

  const getBadge = (status: DiffStatus) => {
    switch (status) {
      case 'modificado':
        return (
          <Badge variant="terracotta" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Modificado</span>
          </Badge>
        );
      case 'agregado':
        return (
          <Badge variant="mint" className="gap-1">
            <PlusCircle className="w-3 h-3" />
            <span>Agregado</span>
          </Badge>
        );
      case 'sin_cambios':
        return (
          <Badge variant="neutral" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sin cambios</span>
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-editorial text-3xl text-ink font-normal">
              Comparativa Longitudinal — Diamante Profesional
            </h1>
            <p className="text-xs text-ink-muted">
              Cotejo literal campo a campo entre la Versión {versionA.versionNumber} ({versionA.closedAt ? new Date(versionA.closedAt).toLocaleDateString() : 'Anterior'}) y la Versión {versionB.versionNumber} ({versionB.closedAt ? new Date(versionB.closedAt).toLocaleDateString() : 'Reciente'}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={onRequestRenewal} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Iniciar nuevo ciclo de revisión</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <span className="text-xs text-ink-muted font-medium">Campos analizados</span>
          <p className="text-2xl font-bold text-ink mt-0.5">{comparison.summary.totalFields}</p>
        </Card>
        <Card padding="sm" className="text-center bg-orange-50/50 border-orange-100">
          <span className="text-xs text-orange-800 font-medium">Modificados</span>
          <p className="text-2xl font-bold text-secondary mt-0.5">{comparison.summary.modified}</p>
        </Card>
        <Card padding="sm" className="text-center bg-teal-50/50 border-teal-100">
          <span className="text-xs text-teal-800 font-medium">Agregados</span>
          <p className="text-2xl font-bold text-teal-700 mt-0.5">{comparison.summary.added}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <span className="text-xs text-ink-muted font-medium">Sin cambios</span>
          <p className="text-2xl font-bold text-ink mt-0.5">{comparison.summary.unchanged}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted mr-2">
          Filtrar vista:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-ink text-white'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Todos ({comparison.summary.totalFields})
        </button>
        <button
          onClick={() => setFilter('modificado')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'modificado'
              ? 'bg-secondary text-white'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Modificados ({comparison.summary.modified})
        </button>
        <button
          onClick={() => setFilter('agregado')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'agregado'
              ? 'bg-teal-700 text-white'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Agregados ({comparison.summary.added})
        </button>
      </div>

      {/* Section 1: Exploraciones Previas */}
      <div className="space-y-4">
        <h2 className="font-editorial text-2xl text-ink font-normal">
          1. Exploraciones Previas (3 campos)
        </h2>
        <div className="space-y-4">
          {comparison.explorations
            .filter(exp => filter === 'all' || exp.status === filter)
            .map(exp => (
              <Card key={exp.key} padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {exp.title}
                    </span>
                    <p className="text-sm text-ink-muted mt-0.5">{exp.question}</p>
                  </div>
                  <div>{getBadge(exp.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
                  <div className="p-3 rounded-lg bg-surface-sand/40 border border-border-subtle">
                    <span className="text-2xs font-semibold text-ink-muted uppercase">
                      Versión {versionA.versionNumber} (Anterior)
                    </span>
                    <p className="mt-1 text-sm text-ink whitespace-pre-wrap font-sans">
                      {exp.contextA || <span className="italic text-ink-muted">Sin respuesta</span>}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-primary/20 shadow-xs">
                    <span className="text-2xs font-semibold text-primary uppercase">
                      Versión {versionB.versionNumber} (Reciente)
                    </span>
                    <p className="mt-1 text-sm text-ink whitespace-pre-wrap font-sans">
                      {exp.contextB || <span className="italic text-ink-muted">Sin respuesta</span>}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Section 2: Decisiones Estratégicas Profesionales */}
      <div className="space-y-4 pt-4">
        <h2 className="font-editorial text-2xl text-ink font-normal">
          2. Decisiones Estratégicas Profesionales (5 niveles)
        </h2>
        <div className="space-y-4">
          {comparison.professionalChoices
            .filter(c => filter === 'all' || c.status === filter)
            .map(c => (
              <Card key={c.index} padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Nivel {c.index + 1}: {c.title}
                    </span>
                    <p className="text-sm text-ink-muted mt-0.5">{c.question}</p>
                  </div>
                  <div>{getBadge(c.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
                  <div className="p-3 rounded-lg bg-surface-sand/40 border border-border-subtle">
                    <span className="text-2xs font-semibold text-ink-muted uppercase">
                      Versión {versionA.versionNumber} (Anterior)
                    </span>
                    <p className="mt-1 text-sm text-ink whitespace-pre-wrap font-sans">
                      {c.answerA || <span className="italic text-ink-muted">Sin respuesta</span>}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-primary/20 shadow-xs">
                    <span className="text-2xs font-semibold text-primary uppercase">
                      Versión {versionB.versionNumber} (Reciente)
                    </span>
                    <p className="mt-1 text-sm text-ink whitespace-pre-wrap font-sans">
                      {c.answerB || <span className="italic text-ink-muted">Sin respuesta</span>}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
