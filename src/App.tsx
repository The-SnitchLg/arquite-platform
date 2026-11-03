import React, { useState, useEffect } from 'react';
import { repository } from './lib/storage';
import { UserProfile, JourneyData } from './types/domain';
import { AppHeader, NavTab } from './components/layout/AppHeader';
import { AuthView } from './features/auth/AuthView';
import { PanoramaView } from './features/panorama/PanoramaView';
import { DiamondView } from './features/diamond/DiamondView';
import { ThresholdsView } from './features/thresholds/ThresholdsView';
import { InterventionsView } from './features/interventions/InterventionsView';
import { LettersView } from './features/letters/LettersView';
import { ReportsHubView } from './features/reports/ReportsHubView';
import { AdminView } from './features/admin/AdminView';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => repository.getCurrentUser());
  const [journey, setJourney] = useState<JourneyData | null>(() => repository.getJourney());
  const [activeTab, setActiveTab] = useState<NavTab>('panorama');

  useEffect(() => {
    const unsubscribe = repository.subscribe(() => {
      const u = repository.getCurrentUser();
      setUser(u);
      setJourney(repository.getJourney());
    });
    return unsubscribe;
  }, []);

  // Sync default tab if admin logs in
  useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'panorama') {
      setActiveTab('admin');
    }
  }, [user]);

  const handleLogout = () => {
    repository.logout();
    setActiveTab('panorama');
  };

  if (!user || !journey) {
    return <AuthView onSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-canvas-cream flex flex-col font-sans text-ink">
      <AppHeader
        user={user}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onOpenLogin={() => {}}
      />

      <main className="flex-1">
        {activeTab === 'panorama' && (
          <PanoramaView
            user={user}
            journey={journey}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'diamante' && (
          <DiamondView
            journey={journey}
            onNavigateToReports={() => setActiveTab('informes')}
          />
        )}

        {activeTab === 'umbrales' && (
          <ThresholdsView
            journey={journey}
            onNavigateToReports={() => setActiveTab('informes')}
            onNavigateToInterventions={() => setActiveTab('intervenciones')}
          />
        )}

        {activeTab === 'intervenciones' && (
          <InterventionsView
            journey={journey}
            onNavigateToThresholds={() => setActiveTab('umbrales')}
          />
        )}

        {activeTab === 'cartas' && (
          <LettersView
            journey={journey}
            onNavigateToReports={() => setActiveTab('informes')}
          />
        )}

        {activeTab === 'informes' && (
          <ReportsHubView
            user={user}
            journey={journey}
          />
        )}

        {activeTab === 'admin' && user.role === 'admin' && (
          <AdminView currentUser={user} />
        )}
      </main>

      <footer className="border-t border-border-subtle bg-surface-white py-6 mt-16 text-center text-xs text-ink-muted no-print">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-sm text-ink font-semibold">ARQUITÉ</span>
            <span>· Estudio de Dirección Estratégica & Liderazgo</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacidad & Consentimiento</span>
            <span>·</span>
            <span>Snapshots Inmutables & Auditoría</span>
            <span>·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
