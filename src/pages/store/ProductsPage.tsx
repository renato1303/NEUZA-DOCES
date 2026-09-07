import React, { useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal, Package, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/store/ProductCard';
import { formatCurrency } from '../../utils/formatters';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
  initialCategorySlug?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  initialCategorySlug,
}) => {
  const { products, categories } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategorySlug) {
      const match = categories.find((c) => c.slug === initialCategorySlug);
      return match ? match.id : 'all';
    }
    return 'all';
  });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [saleTypeFilter, setSaleTypeFilter] = useState<'all' | 'pote' | 'caixa'>('all');
  const [priceMax, setPriceMax] = useState<number>(200);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Active products only
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.active);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      // Search by name or description
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Sale type allowed
      if (saleTypeFilter === 'pote' && p.sale_type_allowed === 'caixa') return false;
      if (saleTypeFilter === 'caixa' && p.sale_type_allowed === 'pote') return false;

      // Price filter (based on pote price or box price)
      if (p.price_unit > priceMax && p.price_box > priceMax) {
        return false;
      }

      return true;
    });
  }, [
    activeProducts,
    searchQuery,
    selectedCategory,
    inStockOnly,
    saleTypeFilter,
    priceMax,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setSaleTypeFilter('all');
    setPriceMax(200);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    inStockOnly ||
    saleTypeFilter !== 'all' ||
    priceMax < 200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Catálogo de Doces
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Todos os autênticos doces tradicionais da Neuza Doces disponíveis em potes e caixas no atacado.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-products-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-900" />
            <span>Filtros do Catálogo {hasActiveFilters && '(Ativos)'}</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            {filteredProducts.length} itens encontrados
          </span>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-6`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-slate-900">
              <Filter className="w-4 h-4 text-blue-900" />
              <span>Filtros</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Categorias
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Todas as Categorias</span>
                <span className="text-[11px] text-slate-400">({activeProducts.length})</span>
              </button>
              {categories.filter((c) => c.active).map((cat) => {
                const count = activeProducts.filter((p) => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200/60'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-slate-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modalidade de Venda */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Modalidade de Compra
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="saletype"
                  checked={saleTypeFilter === 'all'}
                  onChange={() => setSaleTypeFilter('all')}
                  className="text-blue-900 focus:ring-blue-900"
                />
                <span>Ambos (Pote ou Caixa)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="saletype"
                  checked={saleTypeFilter === 'pote'}
                  onChange={() => setSaleTypeFilter('pote')}
                  className="text-blue-900 focus:ring-blue-900"
                />
                <span>Venda por Pote</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="saletype"
                  checked={saleTypeFilter === 'caixa'}
                  onChange={() => setSaleTypeFilter('caixa')}
                  className="text-blue-900 focus:ring-blue-900"
                />
                <span>Venda por Caixa (1X6)</span>
              </label>
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-blue-900 focus:ring-blue-900"
              />
              <span>Apenas produtos com estoque</span>
            </label>
          </div>

          {/* Faixa de Preço */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <span>Preço Máximo</span>
              <span className="text-blue-950 font-bold">{formatCurrency(priceMax)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#101e4a] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>R$ 10</span>
              <span>R$ 200</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Results stats */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span>
              Exibindo <strong>{filteredProducts.length}</strong> de {activeProducts.length} produtos
            </span>
            {hasActiveFilters && (
              <span className="text-blue-900 font-semibold">Filtros aplicados</span>
            )}
          </div>

          {/* Products Cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-800">
                Nenhum produto encontrado
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Não encontramos doces que correspondam aos filtros selecionados. Tente ajustar os termos de busca ou limpar os filtros.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#101e4a] text-white text-xs font-semibold hover:bg-[#192f75] transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
