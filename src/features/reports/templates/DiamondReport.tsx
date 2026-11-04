import React from 'react';
import { DiamondVersion, UserProfile } from '../../../types/domain';
import { DiamondSvg10 } from '../../diamond/DiamondSvg10';
import { CANONICAL_EXPLORATIONS, CANONICAL_STAGES } from '../../../domain/constants';

interface DiamondReportProps {
  version: DiamondVersion;
  user: UserProfile;
}

export const DiamondReport: React.FC<DiamondReportProps> = ({ version, user }) => {
  const formattedDate = version.closedAt
    ? new Date(version.closedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Documento Oficial';

  return (
    <div className="arquite-print-document font-sans text-ink bg-white">
      {/* PAGE 1: COVER, DIAMOND SVG & 3 EXPLORATIONS */}
      <div className="arquite-print-page flex flex-col justify-between">
        <div>
          {/* Editorial Top Running Header */}
          <div className="border-b-2 border-primary pb-4 mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · ESTUDIO DE DIRECCIÓN Y ARQUITECTURA ESTRATÉGICA</span>
              <span>VERSIÓN OFICIAL V{version.versionNumber}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal mt-2 leading-tight">
              Mi Arquitectura Estratégica
            </h1>
            <p className="text-xs text-ink-muted mt-1 italic">
              Adaptación personal y profesional de la cascada de elecciones estratégicas de Playing to Win
            </p>

            {/* Document Metadata Strip */}
            <div className="mt-3 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-ink">
              <div>
                <span className="text-ink-muted">Titular: </span>
                <strong className="text-ink">{user.name}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Versión: </span>
                <strong className="text-primary font-bold">v{version.versionNumber}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Fecha de Cierre: </span>
                <strong>{formattedDate}</strong>
              </div>
              <div>
                <span className="text-ink-muted">ID Snapshot: </span>
                <code className="font-mono text-[10px] bg-canvas-subtle px-1.5 py-0.5 rounded">{version.id}</code>
              </div>
            </div>
          </div>

          {/* Symmetrical Vector Diamond SVG Container */}
          <div className="mb-6 flex flex-col items-center justify-center p-4 bg-canvas-cream/60 rounded-2xl border border-border-subtle print-avoid-break">
            <DiamondSvg10 version={version} readOnly className="w-full max-w-[420px] max-h-[320px]" />
            <p className="text-[10px] text-ink-muted tracking-wide mt-2">
              Diez facetas estratégicas activadas · Geometría fractal del doble diamante ARQUITÉ
            </p>
          </div>

          {/* Section I: Three Explorations */}
          <div className="space-y-3 print-avoid-break">
            <div className="flex items-center justify-between border-b border-border-subtle pb-1">
              <h2 className="font-editorial text-xl text-ink font-normal">
                I. Las Tres Exploraciones del Contexto
              </h2>
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                Fundamentos Estratégicos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CANONICAL_EXPLORATIONS.map(exp => (
                <div
                  key={exp.key}
                  className="report-card p-3.5 bg-canvas-subtle/80 rounded-xl border border-border-subtle space-y-1.5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    {exp.title}
                  </span>
                  <p className="text-[11px] font-semibold text-ink leading-snug">{exp.question}</p>
                  <p className="text-[11px] text-ink leading-relaxed whitespace-pre-wrap pt-1.5 border-t border-border-subtle">
                    {version.contexts[exp.key] || 'Sin respuesta registrada.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="pt-4 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Informe de Arquitectura Estratégica</span>
          <span>Página 1 de 2</span>
        </div>
      </div>

      {/* PAGE BREAK */}
      <div className="print-page-break" />

      {/* PAGE 2: TEN DECISIONS & AUDIT STAMP */}
      <div className="arquite-print-page flex flex-col justify-between pt-6">
        <div>
          {/* Editorial Top Running Header (Page 2) */}
          <div className="border-b-2 border-primary pb-3 mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · MI ARQUITECTURA ESTRATÉGICA</span>
              <span>VERSIÓN V{version.versionNumber}</span>
            </div>
            <h2 className="font-editorial text-2xl text-ink font-normal mt-1">
              II. Las Diez Decisiones Estratégicas
            </h2>
          </div>

          {/* Two-Column Grid: Personal & Professional Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dimension: Personal */}
            <div className="space-y-3">
              <div className="pb-1.5 border-b-2 border-primary/40 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Dimensión Personal
                </span>
                <span className="text-[10px] text-ink-muted font-medium">5 Elecciones</span>
              </div>
              {CANONICAL_STAGES.map(stage => (
                <div
                  key={`doc-pers-${stage.index}`}
                  className="report-card p-3 bg-white rounded-xl border border-border-subtle space-y-1"
                >
                  <span className="text-[10px] font-bold text-ink-muted uppercase">
                    {stage.index + 1}. {stage.title}
                  </span>
                  <p className="text-[11px] font-medium text-ink leading-snug">{stage.coreQuestion}</p>
                  <p className="text-[11px] text-ink leading-relaxed whitespace-pre-wrap pt-1 italic">
                    "{version.personalAnswers[stage.index] || 'Sin respuesta'}"
                  </p>
                </div>
              ))}
            </div>

            {/* Dimension: Professional */}
            <div className="space-y-3">
              <div className="pb-1.5 border-b-2 border-primary/40 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Dimensión Profesional
                </span>
                <span className="text-[10px] text-ink-muted font-medium">5 Elecciones</span>
              </div>
              {CANONICAL_STAGES.map(stage => (
                <div
                  key={`doc-prof-${stage.index}`}
                  className="report-card p-3 bg-white rounded-xl border border-border-subtle space-y-1"
                >
                  <span className="text-[10px] font-bold text-ink-muted uppercase">
                    {stage.index + 1}. {stage.title}
                  </span>
                  <p className="text-[11px] font-medium text-ink leading-snug">{stage.coreQuestion}</p>
                  <p className="text-[11px] text-ink leading-relaxed whitespace-pre-wrap pt-1 italic">
                    "{version.professionalAnswers[stage.index] || 'Sin respuesta'}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Audit & Authenticity Stamp */}
          <div className="mt-8 pt-4 border-t-2 border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-ink-muted print-avoid-break">
            <div>
              <p className="font-bold text-ink">ARQUITÉ · Documento Oficial Emitido</p>
              <p className="text-[10px]">Snapshot inmutable confirmado por el titular · Integridad verificada</p>
            </div>
            <div className="text-right sm:text-right">
              <p>Identificador oficial: <code className="font-mono text-[10px] bg-canvas-subtle px-1 rounded">{version.id}</code></p>
              <p className="text-[10px]">Fecha de cierre: {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pt-4 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Informe de Arquitectura Estratégica</span>
          <span>Página 2 de 2</span>
        </div>
      </div>
    </div>
  );
};
