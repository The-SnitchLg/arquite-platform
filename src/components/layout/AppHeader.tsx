import React from 'react';
import { UserProfile } from '../../types/domain';
import { LogOut, Shield, Compass, Sparkles, BookOpen, FileText, LayoutDashboard, Sliders } from 'lucide-react';

export type NavTab = 
  | 'panorama' 
  | 'diamante' 
  | 'diamante_profesional'
  | 'umbrales' 
  | 'intervenciones' 
  | 'cartas' 
  | 'informes' 
  | 'admin';

interface AppHeaderProps {
  user: UserProfile | null;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenLogin
}) => {
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { id: 'panorama' as NavTab, label: 'Panorama', icon: Compass },
    { id: 'diamante' as NavTab, label: 'Mi Diamante', icon: Sparkles },
    { id: 'diamante_profesional' as NavTab, label: 'Mi Diamante Profesional', icon: Sparkles },
    { id: 'umbrales' as NavTab, label: 'Siete Umbrales', icon: Sliders },
    { id: 'intervenciones' as NavTab, label: 'Ruta de Intervención', icon: BookOpen },
    { id: 'cartas' as NavTab, label: 'Cartas al Futuro', icon: FileText },
    { id: 'informes' as NavTab, label: 'Informes', icon: FileText },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin' as NavTab, label: 'Administración', icon: LayoutDashboard });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas-cream/90 backdrop-blur-md border-b border-border-subtle no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onSelectTab(isAdmin && activeTab === 'admin' ? 'admin' : 'panorama')}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm font-editorial text-xl font-bold tracking-tighter">
            A
          </div>
          <div>
            <span className="font-editorial text-xl sm:text-2xl text-ink font-normal tracking-tight block leading-none">
              ARQUITÉ
            </span>
            <span className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold block mt-0.5">
              Estudio de Dirección Estratégica
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop) */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-surface-white/80 p-1 rounded-full border border-border-subtle shadow-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink hover:bg-canvas-subtle'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-ink leading-tight">{user.name}</span>
                <span className="text-[11px] text-ink-muted flex items-center justify-end gap-1">
                  {isAdmin && <Shield className="w-3 h-3 text-secondary inline" />}
                  {user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-white border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      {user && (
        <div className="md:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto border-t border-border-subtle bg-surface-white/60">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                  isActive ? 'bg-primary text-white' : 'text-ink-muted bg-canvas-subtle'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
