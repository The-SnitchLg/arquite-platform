import React, { useState, useEffect } from 'react';
import { JourneyData, ModuleType, UserProfile } from '../../types/domain';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DiamondReport } from './templates/DiamondReport';
import { ProfDiamondReport } from './templates/ProfDiamondReport';
import { ThresholdsReport } from './templates/ThresholdsReport';
import { FutureLettersReport } from './templates/FutureLettersReport';
import { PrintPortal } from './PrintPortal';
import { getReportFilename } from './reportFilenames';
import { 
  Sparkles, 
  Sliders, 
  FileText, 
  Printer, 
  Eye, 
  Lock,
  Download
} from 'lucide-react';

interface ReportsHubViewProps {
  user: UserProfile;
  journey: JourneyData;
}

export const ReportsHubView: React.FC<ReportsHubViewProps> = ({ user, journey }) => {
  const [previewModule, setPreviewModule] = useState<ModuleType | null>(null);
  const [selectedDiamondSlot, setSelectedDiamondSlot] = useState<'A' | 'B'>('A');
  const [selectedProfDiamondSlot, setSelectedProfDiamondSlot] = useState<'A' | 'B'>('A');
  const [activePrintModule, setActivePrintModule] = useState<ModuleType | null>(null);
  const [activePrintSlot, setActivePrintSlot] = useState<'A' | 'B'>('A');

  const thresholdsClosure = journey.closures.find(c => c.module === 'thresholds');
  const lettersClosure = journey.closures.find(c => c.module === 'letters');

  // Closed versions for diamond
  const slotAVersion = journey.diamondSlotA?.status === 'closed' ? journey.diamondSlotA : null;
  const slotBVersion = journey.diamondSlotB?.status === 'closed' ? journey.diamondSlotB : null;

  // Closed versions for prof diamond
  const profSlotAVersion = journey.profDiamondSlotA?.status === 'closed' ? journey.profDiamondSlotA : null;
  const profSlotBVersion = journey.profDiamondSlotB?.status === 'closed' ? journey.profDiamondSlotB : null;
  
  // Resolve current active diamond version for preview
  const previewDiamondVersion = (selectedDiamondSlot === 'B' && slotBVersion) 
    ? slotBVersion 
    : (slotAVersion || slotBVersion);

  // Resolve current active diamond version for print
  const printDiamondVersion = (activePrintSlot === 'B' && slotBVersion)
    ? slotBVersion
    : (slotAVersion || slotBVersion);

  // Resolve current active prof diamond version for preview
  const previewProfDiamondVersion = (selectedProfDiamondSlot === 'B' && profSlotBVersion)
    ? profSlotBVersion
    : (profSlotAVersion || profSlotBVersion);

  // Resolve current active prof diamond version for print
  const printProfDiamondVersion = (activePrintSlot === 'B' && profSlotBVersion)
    ? profSlotBVersion
    : (profSlotAVersion || profSlotBVersion);

  // Restore document title after print dialog closes
  useEffect(() => {
    const handleAfterPrint = () => {
      document.title = 'ARQUITÉ — Estudio de Dirección y Arquitectura Estratégica';
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = (module: ModuleType, slot: 'A' | 'B' = (module === 'diamond_pro' ? selectedProfDiamondSlot : selectedDiamondSlot)) => {
    let filename = '';
    if (module === 'diamond') {
      const ver = (slot === 'B' && slotBVersion) ? slotBVersion : (slotAVersion || slotBVersion);
      filename = getReportFilename('diamond', {
        version: ver?.versionNumber || 1,
        date: ver?.closedAt || new Date()
      });
      setActivePrintSlot(slot);
    } else if (module === 'diamond_pro') {
      const ver = (slot === 'B' && profSlotBVersion) ? profSlotBVersion : (profSlotAVersion || profSlotBVersion);
      filename = getReportFilename('diamond_pro', {
        version: ver?.versionNumber || 1,
        date: ver?.closedAt || new Date()
      });
      setActivePrintSlot(slot);
    } else if (module === 'thresholds') {
      filename = getReportFilename('thresholds', {
        date: thresholdsClosure?.closedAt || new Date()
      });
    } else if (module === 'letters') {
      filename = getReportFilename('letters', {
        date: lettersClosure?.closedAt || new Date()
      });
    }

    setActivePrintModule(module);

    // Set document.title so Chromium uses the exact filename in Save As PDF
    document.title = filename.replace(/\.pdf$/i, '');

    // Allow portal to render in DOM before launching print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal">
          Entregables e Informes Autónomos
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cuatro documentos de calidad editorial independientes. Cada informe se habilita al alcanzar el 100% de sus propios requisitos, sin depender de los otros módulos.
        </p>
      </div>

      {/* The 4 Autonomous Deliverables Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Report 1: Mi Diamante */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant={previewDiamondVersion ? 'sage' : 'neutral'}>
                {previewDiamondVersion ? 'Disponible' : 'Bloqueado'}
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedDiamondSlot('A');
                    setPreviewModule('diamond');
                  }}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver (v{slotAVersion.versionNumber})</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('diamond', 'A')}
                  className="gap-2 px-3"
                  title="Descargar PDF v1"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            )}
            {slotBVersion && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedDiamondSlot('B');
                    setPreviewModule('diamond');
                  }}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver (v{slotBVersion.versionNumber})</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('diamond', 'B')}
                  className="gap-2 px-3"
                  title="Descargar PDF v2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            )}
            {!slotAVersion && !slotBVersion && (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere completar 13/13 y confirmar el diamante.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Report 1b: Mi Diamante Profesional */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant={previewProfDiamondVersion ? 'sage' : 'neutral'}>
                {previewProfDiamondVersion ? 'Disponible' : 'Bloqueado'}
              </Badge>
            </div>

            <h3 className="font-editorial text-2xl text-ink font-normal mb-1">
              Mi Arquitectura Profesional
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-3">
              Informe Diamante Profesional
            </span>
            <p className="text-xs text-ink-muted leading-relaxed mb-6">
              Documento con portada editorial, SVG con 5 facetas activas, 3 exploraciones del entorno profesional y 5 decisiones estratégicas completas.
            </p>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            {profSlotAVersion && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedProfDiamondSlot('A');
                    setPreviewModule('diamond_pro');
                  }}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver (v{profSlotAVersion.versionNumber})</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('diamond_pro', 'A')}
                  className="gap-2 px-3"
                  title="Descargar PDF v1"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            )}
            {profSlotBVersion && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedProfDiamondSlot('B');
                    setPreviewModule('diamond_pro');
                  }}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver (v{profSlotBVersion.versionNumber})</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('diamond_pro', 'B')}
                  className="gap-2 px-3"
                  title="Descargar PDF v2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            )}
            {!profSlotAVersion && !profSlotBVersion && (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere completar 8/8 y confirmar el diamante profesional.</span>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setPreviewModule('thresholds')}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver informe</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('thresholds')}
                  className="gap-2 px-3"
                  title="Descargar PDF de Siete Umbrales"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setPreviewModule('letters')}
                  className="gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver cartas (2/2)</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handlePrint('letters')}
                  className="gap-2 px-3"
                  title="Descargar PDF de Cartas al Futuro"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-canvas-subtle rounded-lg text-xs text-ink-muted flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <span>Requiere redactar y sellar ambas cartas (2/2).</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Screen-Only High-Fidelity Preview Modal */}
      <Modal
        open={previewModule !== null}
        onOpenChange={open => !open && setPreviewModule(null)}
        title={
          previewModule === 'diamond'
            ? 'Informe: Mi Arquitectura Estratégica'
            : previewModule === 'diamond_pro'
            ? 'Informe: Mi Arquitectura Estratégica Profesional'
            : previewModule === 'thresholds'
            ? 'Informe: Mapa de Evolución'
            : 'Informe: Cartas a mi Yo Futuro'
        }
        description="Vista previa oficial del documento A4 editorial."
        maxWidth="4xl"
      >
        <div className="space-y-4">
          {/* Top Actions Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-muted">
                Documento inmutable generado con diseño A4 editorial
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
              {previewModule === 'diamond_pro' && profSlotAVersion && profSlotBVersion && (
                <div className="flex items-center gap-1 bg-canvas-subtle p-1 rounded-lg border border-border-subtle text-xs">
                  <button
                    onClick={() => setSelectedProfDiamondSlot('A')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      selectedProfDiamondSlot === 'A' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Versión 1
                  </button>
                  <button
                    onClick={() => setSelectedProfDiamondSlot('B')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      selectedProfDiamondSlot === 'B' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Versión 2
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => previewModule && handlePrint(previewModule, previewModule === 'diamond_pro' ? selectedProfDiamondSlot : selectedDiamondSlot)}
              className="gap-2 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </Button>
          </div>

          {/* Modal Preview Body: Scrollable Screen Container */}
          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 bg-canvas-subtle/40 rounded-xl border border-border-subtle">
            {previewModule === 'diamond' && previewDiamondVersion && (
              <div className="bg-white p-6 rounded-xl shadow-card border border-border-subtle max-w-[800px] mx-auto">
                <DiamondReport version={previewDiamondVersion} user={user} />
              </div>
            )}

            {previewModule === 'diamond_pro' && previewProfDiamondVersion && (
              <div className="bg-white p-6 rounded-xl shadow-card border border-border-subtle max-w-[800px] mx-auto">
                <ProfDiamondReport version={previewProfDiamondVersion} user={user} />
              </div>
            )}

            {previewModule === 'thresholds' && (
              <div className="bg-white p-6 rounded-xl shadow-card border border-border-subtle max-w-[800px] mx-auto">
                <ThresholdsReport journey={journey} user={user} />
              </div>
            )}

            {previewModule === 'letters' && (
              <div className="bg-white p-6 rounded-xl shadow-card border border-border-subtle max-w-[800px] mx-auto">
                <FutureLettersReport journey={journey} user={user} />
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Dedicated Print Isolation Portal: Rendered strictly to #arquite-print-root outside #root */}
      {(activePrintModule || previewModule) && (
        <PrintPortal>
          {(activePrintModule === 'diamond' || (!activePrintModule && previewModule === 'diamond')) &&
            (printDiamondVersion || previewDiamondVersion) && (
              <DiamondReport
                version={printDiamondVersion || previewDiamondVersion!}
                user={user}
              />
            )}

          {(activePrintModule === 'diamond_pro' || (!activePrintModule && previewModule === 'diamond_pro')) &&
            (printProfDiamondVersion || previewProfDiamondVersion) && (
              <ProfDiamondReport
                version={printProfDiamondVersion || previewProfDiamondVersion!}
                user={user}
              />
            )}

          {(activePrintModule === 'thresholds' || (!activePrintModule && previewModule === 'thresholds')) && (
            <ThresholdsReport journey={journey} user={user} />
          )}

          {(activePrintModule === 'letters' || (!activePrintModule && previewModule === 'letters')) && (
            <FutureLettersReport journey={journey} user={user} />
          )}
        </PrintPortal>
      )}
    </div>
  );
};
