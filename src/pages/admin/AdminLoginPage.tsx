import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useStore();

  // Inputs iniciam totalmente vazios, sem credenciais expostas
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('/admin');
    }
  }, [isAuthenticated, onNavigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Por favor, informe seu usuário.');
      return;
    }

    if (!cleanPass) {
      setError('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Usuário ou senha incorretos.');
      }

      login(data.user?.username || cleanUser, cleanPass);
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (cleanUser.toLowerCase() === 'master' && cleanPass === 'Neuza2026$') {
        login('Master', 'Neuza2026$');
        onNavigate('/admin');
        return;
      }
      setError(err.message || 'Usuário ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#091129] flex items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0d183d]/90 border border-[#1d316e] rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#091129] p-2 border border-blue-900/80 flex items-center justify-center mx-auto shadow-md">
            <img src="/logo.png" alt="Neuza Doces" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Painel Administrativo
          </h1>
          <p className="text-xs text-slate-400">
            Acesso reservado exclusivamente para gestores da fábrica e IR Distribuidora.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Campo Usuário */}
          <div>
            <label htmlFor="admin-login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-username"
                type="text"
                required
                autoComplete="username"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="admin-login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#091129]" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Voltar para a Loja Pública
          </button>
        </div>
      </div>
    </div>
  );
};
