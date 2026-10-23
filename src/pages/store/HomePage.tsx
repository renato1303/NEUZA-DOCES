import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/store/ProductCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, categories } = useStore();

  const activeProducts = products.filter((p) => p.active);
  const featuredProducts = activeProducts.filter((p) => p.featured);
  const pacocasProducts = activeProducts.filter((p) => p.category_id === 'cat-3').slice(0, 4);

  const categoryImages: Record<string, string> = {
    'cat-1': '/doces tradicionais.jpg',
    'cat-3': '/paçocas e amendoim.jpg',
    'cat-4': '/cocada.webp',
    'doces-tradicionais': '/doces tradicionais.jpg',
    'pacocas-amendoim': '/paçocas e amendoim.jpg',
    'cocadas-doces-de-leite': '/cocada.webp',
  };

  return (
    <div className="space-y-16 pb-20 pt-8 sm:pt-12">
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Nossos doces mais vendidos com preços especiais para atacado e varejo.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/produtos')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#091129] hover:bg-[#15234f] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Ver catálogo completo ({activeProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Category Selector (Escolha por Categoria) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Escolha por Categoria
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Navegue pelas linhas de doces tradicionais, paçocas e cocadas artesanais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center max-w-4xl mx-auto">
          {categories.filter(c => c.active).map((cat) => {
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

      {/* Selected Paçocas & Amendoim Showcase */}
      {pacocasProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Mais Pedidos: Linha Amendoim & Paçocas
            </h3>
            <button
              onClick={() => onNavigate('/categoria/pacocas-amendoim')}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              Ver todos da categoria →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pacocasProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
