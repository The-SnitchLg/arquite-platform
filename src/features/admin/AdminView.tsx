import React, { useState } from 'react';
import { UserProfile, JourneyData } from '../../types/domain';
import { repository } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Users, 
  Sparkles, 
  Sliders, 
  FileText, 
  Search, 
  Shield, 
  Eye, 
  History,
  RefreshCw
} from 'lucide-react';
import { CANONICAL_EXPLORATIONS } from '../../domain/constants';

interface AdminViewProps {
  currentUser: UserProfile;
}

export const AdminView: React.FC<AdminViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJourney, setSelectedJourney] = useState<JourneyData | null>(null);
  const [activeTab, setActiveTab] = useState<'receipts' | 'audit'>('receipts');
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    repository.loadAdminData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await repository.loadAdminData();
    setIsRefreshing(false);
  };

  const receipts = repository.getAdminReceipts();
  const auditEvents = repository.getAuditEvents();

  // Metrics
  const totalParticipants = receipts.length;
  const closedDiamonds = receipts.filter(j => j.closures.some(c => c.module === 'diamond')).length;
  const closedThresholds = receipts.filter(j => j.closures.some(c => c.module === 'thresholds')).length;
  const closedLetters = receipts.filter(j => j.closures.some(c => c.module === 'letters')).length;

  const filteredReceipts = receipts.filter(j => 
    j.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDossier = (journeyId: string) => {
    const detail = repository.getAdminParticipantDetail(journeyId);
    setSelectedJourney(detail);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-3xl sm:text-4xl text-ink">
              Panel de Administración
            </span>
            <Badge variant="terracotta" className="gap-1">
              <Shield className="w-3 h-3 text-secondary" />
              <span>Supervisión Operativa Autorizada</span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Acceso directivo a las recepciones, estados de módulos y expedientes retenidos en la base de datos oficial.
          </p>
        </div>

        {/* Tab switch between Receipts and Audit Logs & Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-white text-xs font-medium text-ink-muted hover:text-ink hover:bg-neutral-50 transition-all cursor-pointer"
            title="Sincronizar con base de datos Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>

          <div className="flex items-center bg-surface-white p-1 rounded-lg border border-border-subtle">
            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'receipts' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Recepciones y Expedientes ({totalParticipants})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'audit' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Pista de Auditoría ({auditEvents.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Participantes</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{totalParticipants}</p>
          <span className="text-[11px] text-ink-muted block mt-1">Registros activos en BD</span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Diamantes Cerrados</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{closedDiamonds}</p>
          <span className="text-[11px] text-ink-muted block mt-1">13/13 confirmados</span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Umbrales Cerrados</span>
            <Sliders className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{closedThresholds}</p>
          <span className="text-[11px] text-ink-muted block mt-1">7/7 completados</span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Cartas Selladas</span>
            <FileText className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{closedLetters}</p>
          <span className="text-[11px] text-ink-muted block mt-1">2/2 confirmadas</span>
        </Card>
      </div>

      {activeTab === 'receipts' ? (
        /* Receipts Table Section */
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-surface-white p-3 rounded-xl border border-border-subtle shadow-xs">
            <Search className="w-4 h-4 text-ink-muted ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o correo de participante..."
              className="w-full text-sm bg-transparent border-none text-ink focus:outline-none"
            />
          </div>

          {/* Table Container */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas-subtle border-b border-border-subtle uppercase tracking-wider text-ink-muted font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Participante</th>
                    <th className="py-3.5 px-4">Diamante (Slot A / B)</th>
                    <th className="py-3.5 px-4">Siete Umbrales</th>
                    <th className="py-3.5 px-4">Cartas</th>
                    <th className="py-3.5 px-4">Última Actividad</th>
                    <th className="py-3.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle bg-white">
                  {filteredReceipts.map(journey => {
                    const diaA = journey.diamondSlotA;
                    const diaB = journey.diamondSlotB;
                    const hasClosedThr = journey.closures.some(c => c.module === 'thresholds');
                    const hasClosedLet = journey.closures.some(c => c.module === 'letters');

                    return (
                      <tr key={journey.id} className="hover:bg-canvas-subtle/40 transition-colors">
                        <td className="py-4 px-4 font-medium text-ink">
                          <div>
                            <span className="text-sm font-semibold text-ink block">{journey.ownerName}</span>
                            <span className="text-ink-muted text-xs">{journey.ownerEmail}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {diaA && (
                              <div className="flex items-center gap-1.5">
                                <Badge variant={diaA.status === 'closed' ? 'sage' : 'neutral'}>
                                  v{diaA.versionNumber} {diaA.status === 'closed' ? 'Cerrada' : 'Borrador'}
                                </Badge>
                              </div>
                            )}
                            {diaB && (
                              <div className="flex items-center gap-1.5">
                                <Badge variant={diaB.status === 'closed' ? 'sage' : 'neutral'}>
                                  v{diaB.versionNumber} {diaB.status === 'closed' ? 'Cerrada' : 'Borrador'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={hasClosedThr ? 'sage' : 'neutral'}>
                            {hasClosedThr ? 'Confirmado (7/7)' : `${journey.thresholds.filter(t => t.status !== 'sin_iniciar').length}/7 en curso`}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={hasClosedLet ? 'sage' : 'neutral'}>
                            {hasClosedLet ? 'Sellado (2/2)' : `${[journey.letters.personal.body, journey.letters.profesional.body].filter(Boolean).length}/2 redactadas`}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-ink-muted">
                          {new Date(journey.updatedAt).toLocaleDateString()} {new Date(journey.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDossier(journey.id)}
                            className="gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Expediente</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Audit Log Section */
        <Card padding="lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-editorial text-2xl text-ink font-normal">
                Registro Oficial de Eventos de Seguridad y Auditoría
              </h3>
            </div>
            <span className="text-xs text-ink-muted">
              {auditEvents.length} eventos registrados
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {auditEvents.map(evt => (
              <div key={evt.id} className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle text-xs space-y-1">
                <div className="flex justify-between items-center text-ink-muted">
                  <span className="font-semibold text-primary">{evt.eventType}</span>
                  <span>{new Date(evt.occurredAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <span className="font-medium">Actor: {evt.actorEmail}</span>
                  <span>·</span>
                  <span className="text-ink-muted">Target: {evt.targetKind} ({evt.targetId})</span>
                </div>
                {evt.details && (
                  <p className="text-ink-muted italic pt-0.5">{evt.details}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Participant Dossier Drawer Modal (P10) */}
      <Modal
        open={selectedJourney !== null}
        onOpenChange={open => !open && setSelectedJourney(null)}
        title={selectedJourney ? `Expediente: ${selectedJourney.ownerName}` : 'Expediente'}
        description={selectedJourney ? `Correo: ${selectedJourney.ownerEmail} · ID: ${selectedJourney.id}` : ''}
        maxWidth="4xl"
      >
        {selectedJourney && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            {/* Version Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slot A */}
              <div className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase text-primary">Diamante Slot A</span>
                  <Badge variant={selectedJourney.diamondSlotA?.status === 'closed' ? 'sage' : 'neutral'}>
                    v{selectedJourney.diamondSlotA?.versionNumber || 1} {selectedJourney.diamondSlotA?.status}
                  </Badge>
                </div>
                {selectedJourney.diamondSlotA && (
                  <div className="text-xs text-ink space-y-1">
                    <p>Iniciado: {new Date(selectedJourney.diamondSlotA.startedAt).toLocaleDateString()}</p>
                    {selectedJourney.diamondSlotA.closedAt && (
                      <p>Cerrado: {new Date(selectedJourney.diamondSlotA.closedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Slot B */}
              <div className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase text-primary">Diamante Slot B</span>
                  <Badge variant={selectedJourney.diamondSlotB?.status === 'closed' ? 'sage' : 'neutral'}>
                    {selectedJourney.diamondSlotB ? `v${selectedJourney.diamondSlotB.versionNumber} ${selectedJourney.diamondSlotB.status}` : 'Sin crear'}
                  </Badge>
                </div>
                {selectedJourney.diamondSlotB && (
                  <div className="text-xs text-ink space-y-1">
                    <p>Iniciado: {new Date(selectedJourney.diamondSlotB.startedAt).toLocaleDateString()}</p>
                    {selectedJourney.diamondSlotB.closedAt && (
                      <p>Cerrado: {new Date(selectedJourney.diamondSlotB.closedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Explorations of active or closed version */}
            {selectedJourney.diamondSlotA && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink border-b border-border-subtle pb-1">
                  Exploraciones Contextuales (Versión 1)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {CANONICAL_EXPLORATIONS.map(exp => (
                    <div key={exp.key} className="p-3 bg-white rounded-lg border border-border-subtle space-y-1">
                      <span className="font-semibold text-primary block">{exp.title}</span>
                      <p className="text-ink leading-relaxed">
                        {selectedJourney.diamondSlotA?.contexts[exp.key] || <em className="text-ink-muted">Sin respuesta</em>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Letters Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-ink border-b border-border-subtle pb-1">
                Cartas al Futuro
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-xl border border-border-subtle space-y-2">
                  <span className="font-semibold text-secondary uppercase block">Carta Personal</span>
                  <p className="leading-relaxed whitespace-pre-wrap italic">
                    {selectedJourney.letters.personal.body || <em className="text-ink-muted">Sin redactar</em>}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-border-subtle space-y-2">
                  <span className="font-semibold text-secondary uppercase block">Carta Profesional</span>
                  <p className="leading-relaxed whitespace-pre-wrap italic">
                    {selectedJourney.letters.profesional.body || <em className="text-ink-muted">Sin redactar</em>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
