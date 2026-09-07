import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

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

  const handleQuickDemoLogin = () => {
    setEmail('admin@neuzadoces.com.br');
    setPassword('admin123');
    login('admin@neuzadoces.com.br', 'admin123');
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Neuza Doces
          </h1>
          <p className="text-xs text-slate-400">
            Painel de Gestão Comercial e E-commerce
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-mail Administrativo
            </label>
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
            className="w-full py-3.5 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-4 border-t border-slate-700/80 space-y-2 text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Acesso de Demonstração
          </span>
          <button
            type="button"
            id="quick-demo-login-btn"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-blue-500/40 bg-blue-950/60 text-amber-300 hover:bg-blue-900/60 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Entrar direto como Administrador
          </button>

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
