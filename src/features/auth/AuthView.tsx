import React, { useState } from 'react';
import { repository } from '../../lib/storage';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        const res = await repository.register(name, email, password);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Error al crear la cuenta.');
        }
      } else {
        const res = await repository.login(email, password);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Credenciales inválidas.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary items-center justify-center text-white font-editorial text-2xl font-bold shadow-sm mb-4">
            A
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            ARQUITÉ
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {isRegister
              ? 'Comienza la arquitectura estratégica de tu liderazgo'
              : 'Acceso seguro al estudio de dirección estratégica'}
          </p>
        </div>

        {/* Card */}
        <Card padding="lg" className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Roberto Sánchez"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@organizacion.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-mint focus:border-primary transition-all"
              />
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" className="mt-2" disabled={isLoading}>
              <span>{isLoading ? 'Conectando...' : (isRegister ? 'Crear mi cuenta' : 'Ingresar al estudio')}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 pt-4 border-t border-border-subtle text-center text-xs text-ink-muted">
            {isRegister ? (
              <span>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => { setIsRegister(false); setError(null); }}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </span>
            ) : (
              <span>
                ¿Primera vez en ARQUITÉ?{' '}
                <button
                  onClick={() => { setIsRegister(true); setError(null); }}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
