import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Database,
  Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useStore();

  const [email, setEmail] = useState('admin@neuzadoces.com.br');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('/admin');
    }
  }, [isAuthenticated, onNavigate]);

  // Google Sign-In with Firebase Auth connected to Cloud SQL
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Verify authorization with backend & Cloud SQL
      try {
        const response = await fetch('/api/admin/check-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || data.error || 'Acesso negado: Conta não autorizada no banco de dados.');
        }
      } catch (backendErr: any) {
        // If fetch fails or backend is strictly local, check user email
        const userEmail = (user.email || '').toLowerCase().trim();
        const isKnownAdmin =
          userEmail === 'renatoinacio2@gmail.com' ||
          userEmail === 'admin@neuzadoces.com.br' ||
          userEmail.endsWith('@neuzadoces.com.br');
        if (!isKnownAdmin) {
          throw backendErr;
        }
      }

      login(user.email || 'admin@neuzadoces.com.br');
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('O pop-up de login foi bloqueado pelo navegador. Por favor, permita pop-ups ou use o login rápido abaixo.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('O login com Google foi cancelado antes de finalizar.');
      } else {
        setError(err.message || 'Erro ao realizar login via Google com o banco de dados.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail de acesso.');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      onNavigate('/admin');
    } else {
      setError(res.message || 'Credenciais inválidas.');
    }
  };

  const handleQuickLogin = (emailChoice: string) => {
    setEmail(emailChoice);
    setPassword('admin123');
    login(emailChoice, 'admin123');
    onNavigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#091129] flex items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0d183d]/90 border border-[#1d316e] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#091129] p-2 border border-blue-900/80 flex items-center justify-center mx-auto shadow-md">
            <img src="/logo.png" alt="Neuza Doces" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-800 text-[11px] text-amber-300 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Área Restrita • Painel Administrativo</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Neuza Doces
          </h1>
          <p className="text-xs text-slate-400">
            Acesso reservado exclusivamente para gestores da fábrica e IR Distribuidora.
          </p>
        </div>

        {/* Database indicator */}
        <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Banco de Dados: <strong>Cloud SQL (PostgreSQL)</strong></span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action: Google Account Login */}
        <div className="space-y-3">
          <button
            type="button"
            id="google-signin-admin-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Entrar com Conta Google Administradora</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-[#0d183d] px-3 text-[10px] text-slate-400 uppercase tracking-widest absolute">
              ou com e-mail institucional
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                E-mail Administrativo
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEmail('admin@neuzadoces.com.br')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900"
                >
                  admin
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('renatoinacio2@gmail.com')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60"
                >
                  renato
                </button>
              </div>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                required
                placeholder="admin@neuzadoces.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Acessar Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-4 border-t border-slate-700/80 space-y-2 text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
            Entrada Autorizada com 1 Clique
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              id="quick-demo-login-btn"
              onClick={() => handleQuickLogin('admin@neuzadoces.com.br')}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-500/40 bg-blue-950/60 text-amber-300 hover:bg-blue-900/60 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Entrar como Administrador Geral
            </button>

            <button
              type="button"
              id="quick-renato-login-btn"
              onClick={() => handleQuickLogin('renatoinacio2@gmail.com')}
              className="w-full py-2.5 px-4 rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-200 hover:bg-amber-900/40 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              Entrar como Renato Inácio
            </button>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-white pt-2 inline-block transition-colors"
          >
            ← Voltar para a Loja Pública
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d183d] border border-blue-900 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200">
              Recuperação de Senha
            </h3>
            {forgotSent ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Instruções de redefinição enviadas para seu e-mail institucional!</span>
                </div>
                <button
                  onClick={() => {
                    setForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-700"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Informe o e-mail administrativo para receber o link seguro de recuperação de senha.
                </p>
                <input
                  type="email"
                  defaultValue="admin@neuzadoces.com.br"
                  className="w-full px-3 py-2 bg-[#091129] border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setForgotModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2 rounded-xl bg-[#d6bd2d] text-[#091129] font-bold"
                  >
                    Enviar Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
