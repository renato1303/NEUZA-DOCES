import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  FileBarChart,
  Settings,
  LogOut,
  Bell,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDateTime } from '../utils/formatters';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const { currentUser, logout, notifications, markNotificationAsRead, clearNotifications } =
    useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Produtos', path: '/admin/produtos', icon: Package },
    { label: 'Categorias', path: '/admin/categorias', icon: FolderTree },
    { label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingBag },
    { label: 'Clientes', path: '/admin/clientes', icon: Users },
    { label: 'Estoque', path: '/admin/estoque', icon: Boxes },
    { label: 'Relatórios', path: '/admin/relatorios', icon: FileBarChart },
    { label: 'Configurações', path: '/admin/configuracoes', icon: Settings },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#091129] text-slate-200 shrink-0 border-r border-[#15234d] z-30">
        {/* Brand */}
        <div className="p-5 border-b border-[#15234d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0d183d] p-1 border border-blue-900/60 flex items-center justify-center shadow-inner">
              <img src="/logo.png" alt="Neuza Doces" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block">
                Neuza Doces
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#d6bd2d] font-bold block">
                Painel Gestão
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#d6bd2d] text-[#091129] shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#091129]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & Store link */}
        <div className="p-3 border-t border-[#15234d] space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Loja Pública
            </span>
            <span className="text-[10px] bg-blue-900/80 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
              Vitrine
            </span>
          </button>

          <div className="pt-2 border-t border-[#15234d]/60 flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <span className="block font-semibold text-slate-200 truncate text-[11px]">
                  {currentUser?.name || 'Administrador'}
                </span>
                <span className="block text-[10px] text-amber-400">Admin Geral</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
          {/* Mobile menu button & brand */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Neuza Doces" className="w-7 h-7 object-contain" />
              <span className="font-serif font-bold text-slate-900 text-base">Neuza Doces</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-900" />
            <span>Painel Administrativo da Operação • Neuza Doces</span>
          </div>

          {/* Right Header actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-900" />
              <span>Ver Loja</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="admin-notifications-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-slate-900">
                      Notificações do Sistema
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-500 hover:text-blue-900 font-medium"
                    >
                      Limpar todas
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.order_id) {
                              onNavigate(`/admin/pedidos`);
                            } else if (n.product_id) {
                              onNavigate(`/admin/estoque`);
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/70 font-semibold' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-slate-900 font-bold flex items-center gap-1.5">
                              {n.type === 'estoque_baixo' || n.type === 'esgotado' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {formatDateTime(n.created_at)}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed font-normal">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Nenhuma notificação no momento.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#091129] text-slate-200 border-b border-[#15234d] p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/admin' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-[#d6bd2d] text-[#091129] font-bold' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-[#15234d] flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate('/')}
                className="text-amber-400 flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver Loja Pública
              </button>
              <button onClick={handleLogout} className="text-rose-400 font-semibold">
                Sair
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
