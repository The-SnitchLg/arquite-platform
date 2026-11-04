import React from 'react';
import { JourneyData, UserProfile } from '../../../types/domain';

interface FutureLettersReportProps {
  journey: JourneyData;
  user: UserProfile;
}

export const FutureLettersReport: React.FC<FutureLettersReportProps> = ({ journey, user }) => {
  const closure = journey.closures.find(c => c.module === 'letters');
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

  const personalSealedDate = journey.letters.personal.sealedAt
    ? new Date(journey.letters.personal.sealedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : formattedDate;

  const professionalSealedDate = journey.letters.profesional.sealedAt
    ? new Date(journey.letters.profesional.sealedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : formattedDate;

  return (
    <div className="arquite-print-document font-sans text-ink bg-white">
      {/* PAGE 1: COVER & LETTER 1 (PERSONAL) */}
      <div className="arquite-print-page flex flex-col justify-between">
        <div>
          {/* Editorial Top Running Header */}
          <div className="border-b-2 border-primary pb-4 mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · ESTUDIO DE DIRECCIÓN Y ARQUITECTURA ESTRATÉGICA</span>
              <span>INFORME EPISTOLAR OFICIAL</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal mt-2 leading-tight">
              Cartas a mi Yo Futuro
            </h1>
            <p className="text-xs text-ink-muted mt-1 italic">
              Compromisos epistolares y pacto de dirección estratégica en dimensión personal y profesional
            </p>

            {/* Document Metadata Strip */}
            <div className="mt-3 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-ink">
              <div>
                <span className="text-ink-muted">Autor y Titular: </span>
                <strong className="text-ink">{user.name}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Estado Epistolar: </span>
                <strong className="text-primary font-bold">2/2 Cartas Selladas</strong>
              </div>
              <div>
                <span className="text-ink-muted">Fecha de Cierre: </span>
                <strong>{formattedDate}</strong>
              </div>
              <div>
                <span className="text-ink-muted">Identificador: </span>
                <code className="font-mono text-[10px] bg-canvas-subtle px-1.5 py-0.5 rounded">
                  {closure?.id || `let-${journey.id.substring(0, 8)}`}
                </code>
              </div>
            </div>
          </div>

          {/* Letter 1: Personal */}
          <div className="p-6 bg-canvas-cream/50 rounded-2xl border border-border-subtle space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                I. Carta a mi Ser Personal
              </span>
              <span className="text-[10px] text-ink-muted">
                Sellada: {personalSealedDate}
              </span>
            </div>

            {/* Paragraphs flow naturally across pages with editorial serif typography */}
            <div className="font-editorial text-base sm:text-lg text-ink leading-relaxed whitespace-pre-wrap">
              {journey.letters.personal.body || 'Sin contenido registrado.'}
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="pt-4 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Cartas al Futuro</span>
          <span>Página 1 de 2</span>
        </div>
      </div>

      {/* PAGE BREAK */}
      <div className="print-page-break" />

      {/* PAGE 2: LETTER 2 (PROFESSIONAL) & EPISTOLAR AUDIT STAMP */}
      <div className="arquite-print-page flex flex-col justify-between pt-6">
        <div>
          {/* Editorial Top Running Header (Page 2) */}
          <div className="border-b-2 border-primary pb-3 mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-primary">
              <span>ARQUITÉ · CARTAS A MI YO FUTURO</span>
              <span>DIMENSIÓN PROFESIONAL</span>
            </div>
          </div>

          {/* Letter 2: Professional */}
          <div className="p-6 bg-canvas-cream/50 rounded-2xl border border-border-subtle space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                II. Carta a mi Líder Profesional
              </span>
              <span className="text-[10px] text-ink-muted">
                Sellada: {professionalSealedDate}
              </span>
            </div>

            {/* Paragraphs flow naturally across pages with editorial serif typography */}
            <div className="font-editorial text-base sm:text-lg text-ink leading-relaxed whitespace-pre-wrap">
              {journey.letters.profesional.body || 'Sin contenido registrado.'}
            </div>
          </div>

          {/* Official Audit & Authenticity Stamp */}
          <div className="mt-8 pt-4 border-t-2 border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-ink-muted print-avoid-break">
            <div>
              <p className="font-bold text-ink">ARQUITÉ · Compromiso Epistolar Sellado</p>
              <p className="text-[10px]">Testimonio fiel de dirección estratégica redactado y rubricado por el titular</p>
            </div>
            <div className="text-right sm:text-right">
              <p>ID Documental: <code className="font-mono text-[10px] bg-canvas-subtle px-1 rounded">{closure?.id || 'OFICIAL'}</code></p>
              <p className="text-[10px]">Fecha oficial de cierre: {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pt-4 border-t border-border-subtle flex justify-between text-[10px] text-ink-muted">
          <span>ARQUITÉ · Cartas al Futuro</span>
          <span>Página 2 de 2</span>
        </div>
      </div>
    </div>
  );
};
