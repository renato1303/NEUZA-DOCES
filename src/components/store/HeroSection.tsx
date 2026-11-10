import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  const badge = settings.hero_badge || 'TRADIÇÃO ARTESANAL BRASILEIRA';
  const title = settings.hero_title || 'Doces artesanais tradicionais com o sabor inconfundível da Neuza Doces.';
  const subtitle =
    settings.hero_subtitle ||
    'Receitas feitas em tachos com ingredientes selecionados. Potes avulsos e caixas fechadas no atacado para todo o Brasil.';
  const ctaText = settings.hero_cta_text || 'Ver Catálogo Completo';

  return (
    <section className="relative bg-[#091129] text-slate-100 py-14 sm:py-16 lg:py-20 border-b border-blue-950 text-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-900/60 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{badge}</span>
          </div>
        )}

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {ctaText && (
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/produtos')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-sm transition-all shadow-md hover:shadow-yellow-500/20 active:scale-95 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
