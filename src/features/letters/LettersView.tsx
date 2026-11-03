import React, { useState } from 'react';
import { JourneyData, Dimension } from '../../types/domain';
import { repository } from '../../lib/storage';
import { calculateLettersProgress } from '../../domain/completeness';
import { isValidNarrative } from '../../domain/constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FileText, CheckCircle2, FileCheck, Stamp } from 'lucide-react';

interface LettersViewProps {
  journey: JourneyData;
  onNavigateToReports: () => void;
}

export const LettersView: React.FC<LettersViewProps> = ({ journey, onNavigateToReports }) => {
  const [activeTab, setActiveTab] = useState<Dimension>('personal');
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');

  const progress = calculateLettersProgress(journey.letters);
  const isClosed = journey.closures.some(c => c.module === 'letters');

  const currentLetter = journey.letters[activeTab];
  const isCurrentValid = isValidNarrative(currentLetter.body);

  const handleBodyChange = (val: string) => {
    if (isClosed) return;
    setSaveStatus('Guardando...');
    repository.saveLetter(activeTab, val);
    setTimeout(() => setSaveStatus('Guardado en tiempo real'), 300);
  };

  const handleSealCurrent = () => {
    repository.sealIndividualLetter(activeTab);
  };

  const handleConfirmClose = () => {
    const res = repository.closeLetters();
    if (res.success) {
      setShowConfirmCloseModal(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-3xl sm:text-4xl text-ink">
              Cartas al Futuro
            </span>
            {isClosed ? (
              <Badge variant="sage">Módulo Confirmado (2/2)</Badge>
            ) : (
              <Badge variant="mint">{progress.validCount} de 2 redactadas</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Conversación epistolar con tu versión futura. Redacta dos cartas independientes: una en tu dimensión personal y otra profesional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isClosed && (
            <Button
              variant="primary"
              size="sm"
              disabled={!progress.readyToClose}
              onClick={() => setShowConfirmCloseModal(true)}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar y cerrar módulo ({progress.validCount}/2)</span>
            </Button>
          )}

          {isClosed && (
            <Button variant="outline" size="sm" onClick={onNavigateToReports}>
              Descargar Informe "Cartas a mi yo futuro"
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Row: Personal & Professional */}
      <div className="flex items-center gap-3 border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'personal'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Carta Personal</span>
          {isValidNarrative(journey.letters.personal.body) && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
          {journey.letters.personal.isSealed && (
            <Badge variant="sage" className="ml-1 text-[10px] py-0 px-1.5">Sellada</Badge>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profesional')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profesional'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Carta Profesional</span>
          {isValidNarrative(journey.letters.profesional.body) && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
          {journey.letters.profesional.isSealed && (
            <Badge variant="sage" className="ml-1 text-[10px] py-0 px-1.5">Sellada</Badge>
          )}
        </button>
      </div>

      {/* Main Letter Editor Card */}
      <Card padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-primary">
              Destinatario: Tu Yo de dentro de 1 a 3 años ({activeTab})
            </span>
            <h3 className="font-editorial text-2xl text-ink font-normal mt-0.5">
              {activeTab === 'personal'
                ? 'Carta a mi ser personal: valores, salud, afectos y serenidad'
                : 'Carta a mi líder profesional: impacto, legado, equipo y dirección'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!isClosed && !currentLetter.isSealed && isCurrentValid && (
              <Button variant="outline" size="sm" onClick={handleSealCurrent} className="gap-1.5">
                <Stamp className="w-3.5 h-3.5 text-secondary" />
                <span>Sellar carta individualmente</span>
              </Button>
            )}
            <Badge variant={isCurrentValid ? 'sage' : 'neutral'}>
              {isCurrentValid ? 'Texto Completo' : 'Borrador (< 10 caracteres)'}
            </Badge>
          </div>
        </div>

        {/* Writing Prompt / Framing */}
        <div className="p-4 bg-canvas-subtle rounded-xl text-xs text-ink-muted leading-relaxed border border-border-subtle">
          {activeTab === 'personal' ? (
            <p>
              Escribe libremente hablándole a tu futuro yo. ¿Qué convicciones personales no quieres traicionar? ¿Qué advertencias te harías sobre el ritmo de vida y el cuidado de tus vínculos fundamentales? ¿Qué esperas agradecerte cuando leas esto?
            </p>
          ) : (
            <p>
              Dirígete a tu yo directivo del futuro. ¿Qué apuestas estratégicas quieres ratificar hoy? ¿De qué tentaciones de atajo u obsolescencia quieres prevenirte? ¿Cómo imaginas la madurez y trascendencia de tu liderazgo?
            </p>
          )}
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            rows={14}
            disabled={isClosed}
            value={currentLetter.body}
            onChange={e => handleBodyChange(e.target.value)}
            placeholder="Querido yo: Hoy comienzo a diseñar mi arquitectura estratégica y te escribo estas líneas para recordar..."
            className="w-full p-5 rounded-xl border border-border-subtle bg-white text-ink font-editorial text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary disabled:bg-canvas-subtle transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-border-subtle">
          <span>{saveStatus}</span>
          <span>
            {currentLetter.body.length} caracteres · Última edición: {new Date(currentLetter.updatedAt).toLocaleTimeString()}
          </span>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmCloseModal}
        onOpenChange={setShowConfirmCloseModal}
        title="Confirmar Cierre de Cartas al Futuro"
        description="Fijarás las dos cartas para generar el informe editorial final."
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            Has redactado tanto tu carta personal como la profesional (2/2). Al confirmar, ambas cartas quedarán registradas en un snapshot inmutable para el documento descargable con maquetación de libro epistolar.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <Button variant="ghost" onClick={() => setShowConfirmCloseModal(false)}>
              Seguir redactando
            </Button>
            <Button variant="primary" onClick={handleConfirmClose} className="gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Confirmar y sellar ambas cartas</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
