import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
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
    navigate(path);
  };
  // @ts-ignore
  const navigate = onNavigate;

  return (
    <header className="sticky top-0 z-40 bg-[#091129] border-b border-blue-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Brand Logo with removed background */}
          <button
            onClick={() => handleNav('/')}
            className="flex flex-col text-left group focus:outline-hidden py-1"
          >
            <img
              src="/logo.png"
              alt="Neuza Doces"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
            <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide mt-0.5">
              distribuído por <span className="font-extrabold text-amber-300">IR Distribuidora</span>
            </span>
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

          {/* Action buttons (Cart only) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
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
        </div>
      )}
    </header>
  );
};
