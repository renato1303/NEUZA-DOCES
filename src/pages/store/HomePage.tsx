import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/store/ProductCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const BEST_SELLER_PRIORITY = [
  'prod-pacoca-caseira',
  'prod-ab',
  'prod-16',
  'prod-pe-de-moca',
  'prod-crocante',
  'prod-04',
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, categories } = useStore();

  const activeProducts = products.filter((p) => p.active);

  const featuredProducts = activeProducts
    .filter((p) => p.featured)
    .sort((a, b) => {
      const idxA = BEST_SELLER_PRIORITY.indexOf(a.id);
      const idxB = BEST_SELLER_PRIORITY.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

  const otherProducts = activeProducts.filter((p) => !p.featured);

  const categoryImages: Record<string, string> = {
    'cat-1': '/doces tradicionais.jpg',
    'cat-3': '/paçocas e amendoim.jpg',
    'cat-4': '/cocada.webp',
    'doces-tradicionais': '/doces tradicionais.jpg',
    'pacocas-amendoim': '/paçocas e amendoim.jpg',
    'cocadas-doces-de-leite': '/cocada.webp',
  };

  const featuredGridCols =
    featuredProducts.length > 0 && featuredProducts.length % 3 === 0 && featuredProducts.length % 4 !== 0
      ? 'lg:grid-cols-3'
      : 'lg:grid-cols-4';

  return (
    <div className="pb-20 pt-8 sm:pt-12">
      {/* Section 1: Featured Products (Os Mais Vendidos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#d6bd2d]/20 border border-[#d6bd2d]/50 text-[#091129] text-[11px] font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Os Mais Vendidos</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-slate-600">
              Os doces campeões de vendas da Neuza Doces com preços especiais para atacado e varejo.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/produtos')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#091129] hover:bg-[#15234f] text-white text-xs font-semibold transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <span>Ver catálogo completo ({activeProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${featuredGridCols} gap-6`}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                showFeaturedBadge
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Nenhum produto em destaque selecionado no momento.
          </div>
        )}
      </section>

      {/* Visual Separator + Section 2: Outros Produtos do Catálogo */}
      {otherProducts.length > 0 && (
        <section className="border-t border-slate-200/90 bg-white/75 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Outros Produtos do Catálogo
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Explore toda a nossa variedade artesanal produzida no tacho com receita tradicional.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/produtos')}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Ver todos no catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Category Selector (Escolha por Categoria) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 border-t border-slate-200/70">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Escolha por Categoria
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Navegue pelas linhas de doces tradicionais, paçocas e cocadas artesanais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center max-w-4xl mx-auto">
          {categories.filter((c) => c.active).map((cat) => {
            const imgUrl = categoryImages[cat.id] || categoryImages[cat.slug] || '/doces tradicionais.jpg';
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(`/categoria/${cat.slug}`)}
                className="group flex flex-col items-center cursor-pointer space-y-3"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-[#d6bd2d] shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                    <img
                      src={imgUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-slate-800 text-center group-hover:text-amber-700 transition-colors uppercase tracking-wide">
                  {cat.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
