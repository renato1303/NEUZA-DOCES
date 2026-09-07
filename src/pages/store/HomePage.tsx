import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HeroSection } from '../../components/store/HeroSection';
import { ProductCard } from '../../components/store/ProductCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useStore();

  const activeProducts = products.filter((p) => p.active);
  const featuredProducts = activeProducts.filter((p) => p.featured);
  const pacocasProducts = activeProducts.filter((p) => p.category_id === 'cat-3').slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Favoritos dos Clientes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Doces em Destaque
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Disponíveis para compra imediata por pote individual ou caixa com 6 potes (1X6).
            </p>
          </div>
          <button
            onClick={() => onNavigate('/produtos')}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-semibold transition-colors"
          >
            Ver catálogo completo ({activeProducts.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Blur & Shadow Section Transition */}
      <div className="relative py-2 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute w-96 h-12 bg-blue-950/5 blur-2xl rounded-full" />
      </div>

      {/* Tradition & Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Ambient blur glow & shadow backdrop */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-900/25 via-amber-500/10 to-blue-900/25 rounded-3xl blur-2xl opacity-70 -z-10 pointer-events-none" />
          <div className="rounded-3xl bg-gradient-to-r from-[#091129] via-[#0d183d] to-[#091129] text-white p-8 sm:p-12 border border-blue-950 shadow-2xl shadow-blue-950/20 overflow-hidden relative">
            <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Autênticos Doces Neuza
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Receitas originais feitas no tacho: <strong>Pé de Moça</strong>, <strong>Paçocas Rolha e Caseira</strong>,{' '}
              <strong>Cocadas Condensadas</strong>, <strong>Quebra Queixo</strong> e <strong>Leite Pingado</strong>.
              Embalagens de 600g a 1,4kg prontas para o consumo familiar ou revenda em caixas completas.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/produtos')}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                Ver Catálogo de Doces
              </button>
              <button
                onClick={() => onNavigate('/categoria/pacocas-amendoim')}
                className="px-6 py-3 rounded-xl border border-blue-600/50 text-blue-200 hover:bg-blue-900/30 font-semibold text-sm transition-colors"
              >
                Paçocas & Linha Amendoim
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Selected Paçocas & Amendoim Showcase */}
        {pacocasProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
              Mais Pedidos: Linha Amendoim & Paçocas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pacocasProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
