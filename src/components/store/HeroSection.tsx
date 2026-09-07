import React from 'react';
import { ArrowRight, Award, Truck } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#091129] via-[#0d183d] to-[#091129] text-slate-100 py-16 lg:py-24 border-b border-blue-950/80 shadow-[0_20px_50px_-15px_rgba(9,17,41,0.3)] z-10">
      {/* Decorative background elements matching logo colors */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Smooth bottom fade to dissolve dot grid */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#091129] to-transparent pointer-events-none" />

      {/* Soft blur & shadow transition between hero section and the next section */}
      <div className="absolute -bottom-8 left-0 right-0 h-14 bg-gradient-to-b from-[#091129]/30 via-[#091129]/10 to-transparent blur-md pointer-events-none" />
      <div className="absolute -bottom-4 left-0 right-0 h-8 bg-slate-900/20 blur-sm pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Doces que transformam qualquer momento em uma{' '}
            <span className="text-amber-300 italic font-normal">experiência especial.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Conheça a seleção completa de doces artesanais da <strong>Neuza Doces</strong>.
            Receitas feitas em tachos com ingredientes puros, textura aveludada e opções de
            compra em <strong>potes avulsos</strong> ou <strong>caixas no atacado</strong>.
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-cta-button"
              onClick={() => onNavigate('/produtos')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-base shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/35 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Ver produtos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/produtos')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-blue-600/50 hover:bg-blue-900/30 text-blue-200 font-semibold text-base transition-colors"
            >
              Tabela de Atacado (CX 1X6)
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 border-t border-blue-950/80 text-xs text-slate-300 max-w-lg mx-auto">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-medium">Ingredientes Selecionados</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-medium">Atacado & Varejo Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
