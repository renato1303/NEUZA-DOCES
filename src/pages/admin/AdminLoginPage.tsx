import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  UserPlus,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  User,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state com as credenciais solicitadas: Usuário "Master" e senha "Neuza2026$"
  const [username, setUsername] = useState('Master');
  const [password, setPassword] = useState('Neuza2026$');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('/admin');
    }
  }, [isAuthenticated, onNavigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Por favor, informe seu usuário de acesso.');
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
        throw new Error(data.message || 'Credenciais inválidas.');
      }

      login(data.user?.username || cleanUser, cleanPass);
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      // Validação direta solicitada para Usuário "Master" e senha "Neuza2026$"
      if (cleanUser.toLowerCase() === 'master' && cleanPass === 'Neuza2026$') {
        login('Master', 'Neuza2026$');
        onNavigate('/admin');
        return;
      }
      setError(
        err.message || 'Usuário ou senha incorretos. Utilize o Usuário: Master e a Senha: Neuza2026$.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanName = regName.trim();
    const cleanUser = regUsername.trim();

    if (!cleanName) {
      setError('Por favor, informe o nome completo.');
      return;
    }

    if (!cleanUser) {
      setError('Por favor, informe o nome de usuário desejado.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setError('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const emailGenerated = cleanUser.includes('@')
        ? cleanUser.toLowerCase()
        : `${cleanUser.toLowerCase()}@neuzadoces.com.br`;

      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: emailGenerated,
          password: regPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao cadastrar novo usuário.');
      }

      setSuccessMsg('Usuário criado com sucesso no banco de dados! Conectando...');
      
      setTimeout(() => {
        login(cleanUser, regPassword);
        onNavigate('/admin');
      }, 1000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Não foi possível cadastrar o usuário.');
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

        {/* Mode Selector Tabs (Entrar / Criar Novo Usuário) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#070e28] rounded-xl border border-blue-950 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#d6bd2d] text-[#091129] shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fazer Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#d6bd2d] text-[#091129] shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Criar Usuário</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 1: FAZER LOGIN */}
        {/* ========================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Quick Access Card for Master */}
            <div className="p-3.5 bg-gradient-to-r from-blue-950/70 to-[#091129] rounded-2xl border border-amber-400/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  Credenciais Oficiais de Acesso:
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Ativo
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-[#060c1e] p-2.5 rounded-xl border border-blue-900/40">
                <div className="space-y-0.5">
                  <div className="text-xs text-white">
                    Usuário: <strong className="text-amber-300 font-mono">Master</strong>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Senha: <strong className="text-amber-300 font-mono">Neuza2026$</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('Master');
                    setPassword('Neuza2026$');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Preencher
                </button>
              </div>
            </div>

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
                  placeholder="Master"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
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
                  placeholder="Neuza2026$"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
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
        )}

        {/* ========================================================== */}
        {/* TAB 2: CRIAR NOVO USUÁRIO */}
        {/* ========================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] leading-relaxed">
              Cadastre um novo usuário com permissões de acesso ao painel da <strong>Neuza Doces</strong>.
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Oliveira"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nome de Usuário *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: gerencia ou vendas"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 4 dígitos"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091129] border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar & Acessar</span>
                </>
              )}
            </button>
          </form>
        )}

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
