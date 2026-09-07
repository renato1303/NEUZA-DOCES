import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const { cartTotalItems, cartSubtotal } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Todos os Doces', path: '/produtos' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#091129] text-slate-100 shadow-md border-b border-blue-950/60">
      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with removed background */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <img
              src="/logo.png"
              alt="Neuza Doces"
              className="h-14 sm:h-16 w-auto object-contain py-1 group-hover:scale-105 transition-transform drop-shadow-sm"
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-900/80 text-amber-300 shadow-xs border border-blue-800/60'
                      : 'text-slate-200 hover:text-white hover:bg-blue-950/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action buttons (Cart & Admin) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNav('/admin')}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-blue-800/60 text-blue-200 hover:bg-blue-950/90 hover:text-amber-300 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Painel
            </button>

            {/* Cart button */}
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
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060c1e] border-t border-blue-950 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-amber-300 hover:bg-blue-950/70"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-blue-950 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/admin')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-300 bg-blue-950/80 flex items-center justify-between"
            >
              <span>Painel Administrativo</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
