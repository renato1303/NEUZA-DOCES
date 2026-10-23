import React from 'react';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate: _onNavigate }) => {
  return (
    <section className="relative bg-[#091129] text-slate-100 py-16 lg:py-20 border-b border-blue-950 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Doces artesanais tradicionais com o sabor inconfundível da{' '}
          <span className="text-amber-300 italic font-normal">Neuza Doces.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Receitas feitas em tachos com ingredientes selecionados. Potes avulsos e caixas fechadas no atacado para todo o Brasil.
        </p>
      </div>
    </section>
  );
};
