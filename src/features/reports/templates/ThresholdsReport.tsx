import React from 'react';
import { JourneyData, UserProfile } from '../../../types/domain';
import { CANONICAL_THRESHOLDS } from '../../../domain/constants';

interface ThresholdsReportProps {
  journey: JourneyData;
  user: UserProfile;
}

export const ThresholdsReport: React.FC<ThresholdsReportProps> = ({ journey, user }) => {
  const closure = journey.closures.find(c => c.module === 'thresholds');
  const formattedDate = closure?.closedAt
    ? new Date(closure.closedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  // Group thresholds by canonical dimensions: Funcional (2), Identitaria (3), Trascendente (2)
  const functionalThresholds = CANONICAL_THRESHOLDS.filter(t => t.band === 'Funcional');
  const identityThresholds = CANONICAL_THRESHOLDS.filter(t => t.band === 'Identitaria');
  const transcendentThresholds = CANONICAL_THRESHOLDS.filter(t => t.band === 'Trascendente');

  const renderThresholdCard = (tMeta: typeof CANONICAL_THRESHOLDS[0]) => {
    const rec = journey.thresholds.find(t => t.key === tMeta.key);
    const statusText = rec?.status
      ? rec.status.replace(/_/g, ' ').toUpperCase()
      : 'COMPLETADO';

    return (
      <div
        key={tMeta.key}
        className="report-card p-4 bg-white rounded-xl border border-border-subtle space-y-2 mb-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-lg text-primary font-bold">{tMeta.romanNumeral}.</span>
            <span className="text-xs font-bold text-ink">{tMeta.title}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 border border-teal-200 text-primary">
            {statusText}
          </span>
        </div>

        <div className="text-[11px] text-ink-muted italic pl-2 border-l-2 border-primary/30">
          "{tMeta.quote}"
        </div>

        <div className="pt-1.5 text-xs text-ink space-y-1">
          <p className="font-semibold text-primary text-[11px]">Reflexión Documentada:</p>
          <p className="leading-relaxed whitespace-pre-wrap text-[11px]">{rec?.reflection || 'Sin reflexión documentada.'}</p>
          {rec?.evidence && (
            <p className="text-ink-muted pt-1 text-[11px]">
              <strong className="text-ink">Evidencia Observada:</strong> {rec.evidence}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="arquite-print-document font-sans text-ink bg-white">
      {/* PAGE 1: COVER & DIMENSIONS 1 & 2 */}
      <div className="arquite-print-page flex flex-col justify-between">
        <div>
          {/* Editorial Top Running Header */}
          <div className="border-b-2 border-primary pb-4 mb-5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · ESTUDIO DE DIRECCIÓN Y ARQUITECTURA ESTRATÉGICA</span>
              <span>INFORME OFICIAL DE UMBRALES</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal mt-2 leading-tight">
              Mapa de Evolución de Liderazgo
            </h1>
            <p className="text-xs text-ink-muted mt-1 italic">
              Registro longitudinal de los siete umbrales en sus dimensiones Funcional, Identitaria y Trascendente
            </p>

            {/* Document Metadata Strip */}
            <div className="mt-3 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-ink">
              <div>
                <span className="text-ink-muted">Titular: </span>
                <strong className="text-ink">{user.name}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Alcance: </span>
                <strong className="text-primary font-bold">7/7 Umbrales Registrados</strong>
              </div>
              <div>
                <span className="text-ink-muted">Fecha de Emisión: </span>
                <strong>{formattedDate}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Identificador: </span>
                <code className="font-mono text-[10px] bg-canvas-subtle px-1.5 py-0.5 rounded">
                  {closure?.id || `umb-${journey.id.substring(0, 8)}`}
                </code>
              </div>
            </div>
          </div>

          {/* Dimension 1: Funcional (Thresholds I & II) */}
          <div className="mb-4">
            <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-primary/40">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                1. Dimensión Funcional · Operación y Pensamiento Sistémico
              </span>
              <span className="text-[10px] text-ink-muted">Umbrales I y II</span>
            </div>
            {functionalThresholds.map(renderThresholdCard)}
          </div>

          {/* Dimension 2: Identitaria (Thresholds III, IV y V) */}
          <div className="mb-2">
            <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-primary/40">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                2. Dimensión Identitaria · Autoridad, Influencia y Rol
              </span>
              <span className="text-[10px] text-ink-muted">Umbrales III, IV y V</span>
            </div>
            {identityThresholds.slice(0, 2).map(renderThresholdCard)}
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="pt-3 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Informe de Siete Umbrales</span>
          <span>Página 1 de 2</span>
        </div>
      </div>

      {/* PAGE BREAK */}
      <div className="print-page-break" />

      {/* PAGE 2: DIMENSION 2 (CONT) & DIMENSION 3 (TRASCENDENTE) */}
      <div className="arquite-print-page flex flex-col justify-between pt-6">
        <div>
          {/* Editorial Top Running Header (Page 2) */}
          <div className="border-b-2 border-primary pb-3 mb-5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · MAPA DE EVOLUCIÓN DE LIDERAZGO</span>
              <span>DIMENSIONES IDENTITARIA Y TRASCENDENTE</span>
            </div>
          </div>

          {/* Remaining Identity Threshold (V) */}
          <div className="mb-4">
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-border-subtle">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Continuación: Dimensión Identitaria
              </span>
              <span className="text-[10px] text-ink-muted">Umbral V</span>
            </div>
            {identityThresholds.slice(2).map(renderThresholdCard)}
          </div>

          {/* Dimension 3: Trascendente (Thresholds VI & VII) */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-primary/40">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                3. Dimensión Trascendente · Futuro y Legado Sistémico
              </span>
              <span className="text-[10px] text-ink-muted">Umbrales VI y VII</span>
            </div>
            {transcendentThresholds.map(renderThresholdCard)}
          </div>

          {/* Official Audit & Authenticity Stamp */}
          <div className="mt-6 pt-4 border-t-2 border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-ink-muted print-avoid-break">
            <div>
              <p className="font-bold text-ink">ARQUITÉ · Documento Oficial Emitido</p>
              <p className="text-[10px]">Registro de 7 umbrales certificado por el titular · Integridad verificada</p>
            </div>
            <div className="text-right sm:text-right">
              <p>ID Registro: <code className="font-mono text-[10px] bg-canvas-subtle px-1 rounded">{closure?.id || 'OFICIAL'}</code></p>
              <p className="text-[10px]">Fecha de emisión: {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pt-3 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Informe de Siete Umbrales</span>
          <span>Página 2 de 2</span>
        </div>
      </div>
    </div>
  );
};
