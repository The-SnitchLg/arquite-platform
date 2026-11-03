import React, { useState } from 'react';
import { DiamondVersion } from '../../types/domain';
import { compareDiamondVersions, DiffStatus } from '../../domain/comparison';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';

interface DiamondComparisonViewProps {
  versionA: DiamondVersion;
  versionB: DiamondVersion;
  onBack: () => void;
  onRequestRenewal: () => void;
}

export const DiamondComparisonView: React.FC<DiamondComparisonViewProps> = ({
  versionA,
  versionB,
  onBack,
  onRequestRenewal
}) => {
  const [filter, setFilter] = useState<'all' | 'modified' | 'added'>('all');
  const comparison = compareDiamondVersions(versionA, versionB);

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
              Comparativa Longitudinal de Versiones
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
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
            filter === 'all' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Todos los 13 campos
        </button>
        <button
          onClick={() => setFilter('modified')}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
            filter === 'modified' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Solo modificados ({comparison.summary.modified})
        </button>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="space-y-8">
        {/* Explorations Section */}
        <div className="space-y-4">
          <h2 className="font-editorial text-2xl text-ink font-normal">
            1. Las Tres Exploraciones Contextuales
          </h2>
          <div className="space-y-4">
            {comparison.explorations
              .filter(e => filter === 'all' || e.status === 'modificado')
              .map(exp => (
                <Card key={exp.key} padding="md">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {exp.title}
                    </span>
                    {getBadge(exp.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-ink-muted uppercase block mb-1">
                        Versión {versionA.versionNumber} (Referencia Anterior)
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {exp.contextA || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-primary uppercase block mb-1">
                        Versión {versionB.versionNumber} (Actualización)
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {exp.contextB || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Personal Choices Section */}
        <div className="space-y-4">
          <h2 className="font-editorial text-2xl text-ink font-normal">
            2. Decisiones Estratégicas Personales (5)
          </h2>
          <div className="space-y-4">
            {comparison.personalChoices
              .filter(c => filter === 'all' || c.status === 'modificado')
              .map(choice => (
                <Card key={`pers-${choice.index}`} padding="md">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {choice.index + 1}. {choice.title}
                    </span>
                    {getBadge(choice.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-ink-muted uppercase block mb-1">
                        Versión {versionA.versionNumber}
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {choice.answerA || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-primary uppercase block mb-1">
                        Versión {versionB.versionNumber}
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {choice.answerB || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Professional Choices Section */}
        <div className="space-y-4">
          <h2 className="font-editorial text-2xl text-ink font-normal">
            3. Decisiones Estratégicas Profesionales (5)
          </h2>
          <div className="space-y-4">
            {comparison.professionalChoices
              .filter(c => filter === 'all' || c.status === 'modificado')
              .map(choice => (
                <Card key={`prof-${choice.index}`} padding="md">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {choice.index + 1}. {choice.title}
                    </span>
                    {getBadge(choice.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-ink-muted uppercase block mb-1">
                        Versión {versionA.versionNumber}
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {choice.answerA || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-border-subtle">
                      <span className="text-[11px] font-semibold text-primary uppercase block mb-1">
                        Versión {versionB.versionNumber}
                      </span>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                        {choice.answerB || <em className="text-ink-muted">Sin respuesta registrada</em>}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
