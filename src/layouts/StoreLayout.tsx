import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FloatingSocialButtons } from '../components/common/FloatingSocialButtons';

interface StoreLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      {/* Top Announcement Bar */}
      <div className="bg-[#d6bd2d] text-[#091129] font-bold text-xs sm:text-sm text-center py-2 px-4 tracking-wide shadow-xs uppercase">
        VARIEDADE, ECONOMIA E PRATICIDADE PARA SUAS COMPRAS!
      </div>

      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <Footer onNavigate={onNavigate} />
      
      {/* Floating WhatsApp & Instagram buttons */}
      <FloatingSocialButtons />
    </div>
  );
};
