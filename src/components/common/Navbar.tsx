import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const { cartTotalItems, cartSubtotal, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('/produtos');
    }
  };

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Todos os Produtos', path: '/produtos' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#091129] border-b border-blue-950 shadow-md">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex flex-col text-left group focus:outline-hidden py-1 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Neuza Doces"
              className="h-12 sm:h-15 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
            <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide mt-0.5 whitespace-nowrap">
              distribuído por <span className="font-extrabold text-amber-300">IR Distribuidora</span>
            </span>
          </button>

          {/* Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que deseja procurar? (ex: Cocada, Pote, Caixa)"
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-blue-900 bg-[#060c1e] text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Right Side Actions: Support, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Central de Atendimento (WhatsApp link) */}
            <a
              href="https://wa.me/5515991576707?text=Olá,%20gostaria%20de%20tirar%20dúvidas%20sobre%20os%20doces%20da%20Neuza%20Doces"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-slate-200 hover:text-amber-300 text-xs font-medium px-3 py-2 rounded-lg bg-blue-950/50 hover:bg-blue-900/60 transition-colors border border-blue-900/50"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 leading-none">Central de Atendimento</div>
                <div className="font-bold text-slate-200 mt-0.5">(15) 99157-6707</div>
              </div>
            </a>

            {/* Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => handleNav('/carrinho')}
              className="relative flex items-center gap-2 bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-yellow-500/20 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-[#091129]" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartTotalItems > 0 && (
                <span className="ml-1 bg-[#091129] text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartTotalItems}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden md:inline text-xs font-bold text-[#091129] border-l border-[#091129]/20 pl-2">
                  {formatCurrency(cartSubtotal)}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-950 focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que deseja procurar?"
              className="w-full pl-10 pr-20 py-2 rounded-xl border border-blue-900 bg-[#060c1e] text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#d6bd2d] text-[#091129] font-bold text-xs rounded-lg"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Secondary Navigation / Category Bar (Centered) */}
      <div className="bg-[#060c1e] border-t border-blue-950/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12 overflow-x-auto no-scrollbar gap-8 text-xs font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`transition-colors whitespace-nowrap hover:text-amber-300 ${
                    isActive ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="h-4 w-px bg-blue-900" />

            {/* Quick Categories */}
            {categories.filter((c) => c.active).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNav(`/categoria/${cat.slug}`)}
                className={`transition-colors whitespace-nowrap hover:text-amber-300 ${
                  currentPath === `/categoria/${cat.slug}`
                    ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5'
                    : 'text-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060c1e] border-t border-blue-950 px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Navegação Principal</div>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-300 hover:bg-blue-950/70"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-blue-950">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Categorias de Doces</div>
            {categories.filter((c) => c.active).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNav(`/categoria/${cat.slug}`)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-blue-950/70"
              >
                • {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-blue-950 space-y-2">
            <a
              href="https://wa.me/5515991576707?text=Olá,%20gostaria%20de%20tirar%20dúvidas%20sobre%20os%20doces%20da%20Neuza%20Doces"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 text-emerald-300 font-semibold text-xs border border-emerald-900"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Central de Atendimento WhatsApp (15) 99157-6707</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
