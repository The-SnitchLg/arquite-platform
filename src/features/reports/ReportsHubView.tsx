import React, { useState } from 'react';
import { JourneyData, ModuleType, UserProfile } from '../../types/domain';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DiamondSvg10 } from '../diamond/DiamondSvg10';
import { CANONICAL_EXPLORATIONS, CANONICAL_STAGES, CANONICAL_THRESHOLDS } from '../../domain/constants';
import { 
  Sparkles, 
  Sliders, 
  FileText, 
  Printer, 
  Eye, 
  Lock 
} from 'lucide-react';

interface ReportsHubViewProps {
  user: UserProfile;
  journey: JourneyData;
}

export const ReportsHubView: React.FC<ReportsHubViewProps> = ({ user, journey }) => {
  const [previewModule, setPreviewModule] = useState<ModuleType | null>(null);
  const [selectedDiamondSlot, setSelectedDiamondSlot] = useState<'A' | 'B'>('A');

  const thresholdsClosure = journey.closures.find(c => c.module === 'thresholds');
  const lettersClosure = journey.closures.find(c => c.module === 'letters');

  // Closed versions for diamond
  const slotAVersion = journey.diamondSlotA?.status === 'closed' ? journey.diamondSlotA : null;
  const slotBVersion = journey.diamondSlotB?.status === 'closed' ? journey.diamondSlotB : null;
  const closedDiamondVersion = (selectedDiamondSlot === 'B' && slotBVersion) 
    ? slotBVersion 
    : (slotAVersion || slotBVersion);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal">
          Entregables e Informes Autónomos
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Tres documentos de calidad editorial independientes. Cada informe se habilita al alcanzar el 100% de sus propios requisitos, sin depender de los otros módulos.
        </p>
      </div>

      {/* The 3 Autonomous Deliverables Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Mi Diamante */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant={closedDiamondVersion ? 'sage' : 'neutral'}>
                {closedDiamondVersion ? 'Disponible' : 'Bloqueado'}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-1">
              Mi Arquitectura Estratégica
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-3">
              Informe del Diamante
            </span>
            <p className="text-xs text-ink-muted leading-relaxed mb-6">
              Documento con portada editorial, SVG vectorial con las 10 facetas coloreadas, 3 exploraciones del contexto y 10 respuestas literales completas.
            </p>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            {slotAVersion && (
              <Button
                variant={selectedDiamondSlot === 'A' ? 'primary' : 'outline'}
                fullWidth
                size="md"
                onClick={() => {
                  setSelectedDiamondSlot('A');
                  setPreviewModule('diamond');
                }}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver y descargar informe (v{slotAVersion.versionNumber})</span>
              </Button>
            )}
            {slotBVersion && (
              <Button
                variant={selectedDiamondSlot === 'B' ? 'primary' : 'outline'}
                fullWidth
                size="md"
                onClick={() => {
                  setSelectedDiamondSlot('B');
                  setPreviewModule('diamond');
                }}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver y descargar informe (v{slotBVersion.versionNumber})</span>
              </Button>
            )}
            {!slotAVersion && !slotBVersion && (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere completar 13/13 y confirmar el diamante.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Report 2: Siete Umbrales */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <Badge variant={thresholdsClosure ? 'sage' : 'neutral'}>
                {thresholdsClosure ? 'Disponible' : 'Bloqueado'}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-1">
              Mapa de Evolución
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block mb-3">
              Informe de Siete Umbrales
            </span>
            <p className="text-xs text-ink-muted leading-relaxed mb-6">
              Registro longitudinal en 3 dimensiones (Funcional, Identitaria, Trascendente), con reflexiones íntegras, evidencias observadas e historial real de cambios.
            </p>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            {thresholdsClosure ? (
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={() => setPreviewModule('thresholds')}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver y descargar informe</span>
              </Button>
            ) : (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere completar los 7 umbrales con evidencia.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Report 3: Cartas al Futuro */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-secondary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant={lettersClosure ? 'sage' : 'neutral'}>
                {lettersClosure ? 'Disponible' : 'Bloqueado'}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-1">
              Cartas a mi Yo Futuro
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary block mb-3">
              Informe Epistolar de Cartas
            </span>
            <p className="text-xs text-ink-muted leading-relaxed mb-6">
              Edición editorial cuidada que reúne la Carta Personal y la Carta Profesional completas, preservando párrafos y fechas oficiales de cierre.
            </p>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            {lettersClosure ? (
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={() => setPreviewModule('letters')}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver y descargar cartas (2/2)</span>
              </Button>
            ) : (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere redactar y sellar ambas cartas (2/2).</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Document Preview & Printable Modal */}
      <Modal
        open={previewModule !== null}
        onOpenChange={open => !open && setPreviewModule(null)}
        title={
          previewModule === 'diamond'
            ? 'Informe: Mi Arquitectura Estratégica'
            : previewModule === 'thresholds'
            ? 'Informe: Mapa de Evolución'
            : 'Informe: Cartas a mi Yo Futuro'
        }
        description="Vista previa del documento oficial. Utiliza el botón de imprimir para guardarlo en PDF A4 de alta fidelidad."
        maxWidth="4xl"
      >
        <div className="printable-scroll-container space-y-6 max-h-[75vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-xl border border-border-subtle font-sans">
          {/* Top Printable Actions Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border-subtle no-print">
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-muted">
                Documento verificado generado desde snapshot inmutable
              </span>
              {previewModule === 'diamond' && slotAVersion && slotBVersion && (
                <div className="flex items-center gap-1 bg-canvas-subtle p-1 rounded-lg border border-border-subtle text-xs">
                  <button
                    onClick={() => setSelectedDiamondSlot('A')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      selectedDiamondSlot === 'A' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Versión 1
                  </button>
                  <button
                    onClick={() => setSelectedDiamondSlot('B')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      selectedDiamondSlot === 'B' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Versión 2
                  </button>
                </div>
              )}
            </div>

            <Button variant="primary" size="sm" onClick={handlePrint} className="gap-2 shrink-0">
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </Button>
          </div>

          {/* Printable Document Body: Diamond */}
          {previewModule === 'diamond' && closedDiamondVersion && (
            <div className="printable-report-wrapper space-y-8 py-4">
              {/* Cover / Header */}
              <div className="border-b-2 border-primary pb-6 print-avoid-break">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  ARQUITÉ · ESTUDIO DE DIRECCIÓN ESTRATÉGICA
                </span>
                <h1 className="font-editorial text-4xl text-ink font-normal mt-2">
                  Mi Arquitectura Estratégica
                </h1>
                <p className="text-sm text-ink-muted mt-1 italic">
                  Adaptación personal y profesional de la cascada de elecciones estratégicas de Playing to Win
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink font-medium">
                  <span>Titular: <strong>{user.name}</strong></span>
                  <span>Versión: <strong>v{closedDiamondVersion.versionNumber}</strong></span>
                  <span>Fecha de Cierre: <strong>{closedDiamondVersion.closedAt ? new Date(closedDiamondVersion.closedAt).toLocaleDateString() : 'Oficial'}</strong></span>
                </div>
              </div>

              {/* Diamond Vector SVG */}
              <div className="py-4 flex flex-col items-center justify-center bg-canvas-cream/50 rounded-2xl p-6 border border-border-subtle print-avoid-break">
                <DiamondSvg10 version={closedDiamondVersion} readOnly className="w-full max-w-[460px]" />
              </div>

              {/* Three Explorations */}
              <div className="space-y-4 print-avoid-break">
                <h2 className="font-editorial text-2xl text-ink border-b border-border-subtle pb-1">
                  I. Las Tres Exploraciones del Contexto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CANONICAL_EXPLORATIONS.map(exp => (
                    <div key={exp.key} className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle space-y-1.5 report-card print-avoid-break">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {exp.title}
                      </span>
                      <p className="text-xs text-ink font-semibold">{exp.question}</p>
                      <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap pt-1 border-t border-border-subtle">
                        {closedDiamondVersion.contexts[exp.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Break for Page 2 */}
              <div className="print-page-break" />

              {/* Ten Choices (Personal & Professional) */}
              <div className="space-y-6 pt-2">
                <div className="border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block">
                    ARQUITÉ · MI ARQUITECTURA ESTRATÉGICA — VERSIÓN V{closedDiamondVersion.versionNumber}
                  </span>
                  <h2 className="font-editorial text-2xl text-ink mt-1">
                    II. Las Diez Decisiones Estratégicas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal */}
                  <div className="space-y-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary block pb-1 border-b border-primary/30">
                      Dimensión Personal
                    </span>
                    {CANONICAL_STAGES.map(stage => (
                      <div key={`doc-pers-${stage.index}`} className="p-4 bg-white rounded-xl border border-border-subtle space-y-1 report-card print-avoid-break">
                        <span className="text-xs font-bold text-ink-muted">
                          {stage.index + 1}. {stage.title}
                        </span>
                        <p className="text-xs font-medium text-ink">{stage.coreQuestion}</p>
                        <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap pt-1 italic">
                          "{closedDiamondVersion.personalAnswers[stage.index]}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Professional */}
                  <div className="space-y-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary block pb-1 border-b border-primary/30">
                      Dimensión Profesional
                    </span>
                    {CANONICAL_STAGES.map(stage => (
                      <div key={`doc-prof-${stage.index}`} className="p-4 bg-white rounded-xl border border-border-subtle space-y-1 report-card print-avoid-break">
                        <span className="text-xs font-bold text-ink-muted">
                          {stage.index + 1}. {stage.title}
                        </span>
                        <p className="text-xs font-medium text-ink">{stage.coreQuestion}</p>
                        <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap pt-1 italic">
                          "{closedDiamondVersion.professionalAnswers[stage.index]}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit & Authenticity Stamp */}
                <div className="mt-8 pt-4 border-t-2 border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-ink-muted print-avoid-break">
                  <div>
                    <p className="font-semibold text-ink">ARQUITÉ · Documento Oficial Emitido</p>
                    <p>Snapshot inmutable confirmado por el titular · Integridad verificada</p>
                  </div>
                  <div className="text-right">
                    <p>Identificador: <code className="font-mono text-[11px]">{closedDiamondVersion.id}</code></p>
                    <p>Fecha oficial de cierre: {closedDiamondVersion.closedAt ? new Date(closedDiamondVersion.closedAt).toLocaleDateString() : 'Confirmado'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printable Document Body: Thresholds */}
          {previewModule === 'thresholds' && (
            <div className="printable-report-wrapper space-y-8 py-4">
              <div className="border-b-2 border-primary pb-6 print-avoid-break">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  ARQUITÉ · ESTUDIO DE DIRECCIÓN ESTRATÉGICA
                </span>
                <h1 className="font-editorial text-4xl text-ink font-normal mt-2">
                  Mapa de Evolución de Liderazgo
                </h1>
                <p className="text-sm text-ink-muted mt-1 italic">
                  Registro documental de los siete umbrales en sus dimensiones Funcional, Identitaria y Trascendente
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink font-medium">
                  <span>Titular: <strong>{user.name}</strong></span>
                  <span>Fecha de Emisión: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
              </div>

              <div className="space-y-6">
                {CANONICAL_THRESHOLDS.map(tMeta => {
                  const rec = journey.thresholds.find(t => t.key === tMeta.key);

                  return (
                    <div key={tMeta.key} className="p-5 bg-white rounded-xl border border-border-subtle space-y-2 report-card print-avoid-break">
                      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                        <div className="flex items-center gap-2">
                          <span className="font-editorial text-lg text-primary">{tMeta.romanNumeral}.</span>
                          <span className="text-sm font-semibold text-ink">{tMeta.title}</span>
                          <span className="text-xs text-ink-muted">({tMeta.band})</span>
                        </div>
                        <Badge variant="sage">{rec?.status || 'Completado'}</Badge>
                      </div>

                      <div className="text-xs text-ink-muted italic">
                        "{tMeta.quote}"
                      </div>

                      <div className="pt-2 text-xs text-ink space-y-1">
                        <p className="font-semibold text-primary">Reflexión Documentada:</p>
                        <p className="leading-relaxed whitespace-pre-wrap">{rec?.reflection}</p>
                        {rec?.evidence && (
                          <p className="text-ink-muted pt-1">
                            <strong>Evidencia:</strong> {rec.evidence}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Printable Document Body: Letters */}
          {previewModule === 'letters' && (
            <div className="printable-report-wrapper space-y-8 py-4">
              <div className="border-b-2 border-primary pb-6 print-avoid-break">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  ARQUITÉ · ESTUDIO DE DIRECCIÓN ESTRATÉGICA
                </span>
                <h1 className="font-editorial text-4xl text-ink font-normal mt-2">
                  Cartas a mi Yo Futuro
                </h1>
                <p className="text-sm text-ink-muted mt-1 italic">
                  Compromisos epistolares en dimensión personal y profesional
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink font-medium">
                  <span>Autor: <strong>{user.name}</strong></span>
                  <span>Fecha: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Letter 1: Personal */}
              <div className="p-8 bg-canvas-subtle rounded-2xl border border-border-subtle space-y-4 report-card print-avoid-break">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block pb-2 border-b border-border-subtle">
                  I. Carta a mi Ser Personal
                </span>
                <div className="font-editorial text-lg text-ink leading-relaxed whitespace-pre-wrap">
                  {journey.letters.personal.body}
                </div>
              </div>

              <div className="print-page-break" />

              {/* Letter 2: Professional */}
              <div className="p-8 bg-canvas-subtle rounded-2xl border border-border-subtle space-y-4 report-card print-avoid-break">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block pb-2 border-b border-border-subtle">
                  II. Carta a mi Líder Profesional
                </span>
                <div className="font-editorial text-lg text-ink leading-relaxed whitespace-pre-wrap">
                  {journey.letters.profesional.body}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
