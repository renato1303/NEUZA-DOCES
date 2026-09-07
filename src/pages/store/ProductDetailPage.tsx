import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Package,
  Plus,
  Minus,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SaleType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StockBadge } from '../../components/common/Badge';
import { ProductCard } from '../../components/store/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, categories, addToCart } = useStore();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedFormat, setSelectedFormat] = useState<SaleType>('pote');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Produto não encontrado</h2>
        <p className="text-sm text-stone-500">
          O doce que você procura pode ter sido desativado ou o endereço está incorreto.
        </p>
        <button
          onClick={() => onNavigate('/produtos')}
          className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const currentImage = activeImage || product.image_url;
  const isOutOfStock = product.stock <= 0;

  // Maximum quantity selectable based on stock
  const unitsMultiplier = selectedFormat === 'caixa' ? product.units_per_box : 1;
  const maxAllowedQuantity = Math.max(1, Math.floor(product.stock / unitsMultiplier));

  const unitPrice = selectedFormat === 'caixa' ? product.price_box : product.price_unit;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedFormat, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedFormat, quantity);
    onNavigate('/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.active && p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-blue-900 transition-colors">
          Início
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('/produtos')}
          className="hover:text-blue-900 transition-colors"
        >
          Produtos
        </button>
        {category && (
          <>
            <span>/</span>
            <button
              onClick={() => onNavigate(`/categoria/${category.slug}`)}
              className="hover:text-blue-900 transition-colors"
            >
              {category.name}
            </button>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-1/1 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#101e4a] text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Destaque da Fábrica
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <StockBadge stock={product.stock} minStock={product.minimum_stock} />
            </div>
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveImage(product.image_url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  currentImage === product.image_url
                    ? 'border-blue-900 ring-2 ring-blue-900/30'
                    : 'border-slate-200 hover:border-slate-400 opacity-75'
                }`}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    currentImage === img
                      ? 'border-blue-900 ring-2 ring-blue-900/30'
                      : 'border-slate-200 hover:border-slate-400 opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Purchasing Options */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-950">
                {product.line}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-blue-900" />
                {product.packaging} • {product.package_qty_info || '6 potes'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Peso líquido individual: <strong>{product.weight}</strong></p>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {/* Format selection: Pote vs Caixa */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
              Escolha a Forma de Compra
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option Pote */}
              <div
                onClick={() => setSelectedFormat('pote')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'pote'
                    ? 'bg-white border-blue-900 shadow-md ring-1 ring-blue-900/20'
                    : 'bg-white/60 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Venda por Pote</span>
                  <input
                    type="radio"
                    name="format"
                    checked={selectedFormat === 'pote'}
                    onChange={() => setSelectedFormat('pote')}
                    className="accent-[#101e4a]"
                  />
                </div>
                <div className="mt-2 font-serif text-2xl font-bold text-blue-950">
                  {formatCurrency(product.price_unit)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">1 pote individual de {product.weight}</p>
              </div>

              {/* Option Caixa */}
              <div
                onClick={() => setSelectedFormat('caixa')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'caixa'
                    ? 'bg-white border-blue-900 shadow-md ring-1 ring-blue-900/20'
                    : 'bg-white/60 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Venda por Caixa</span>
                  <input
                    type="radio"
                    name="format"
                    checked={selectedFormat === 'caixa'}
                    onChange={() => setSelectedFormat('caixa')}
                    className="accent-[#101e4a]"
                  />
                </div>
                <div className="mt-2 font-serif text-2xl font-bold text-blue-950">
                  {formatCurrency(product.price_box)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Caixa fechada {product.packaging} ({product.units_per_box} potes)
                </p>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxAllowedQuantity, quantity + 1))}
                  disabled={quantity >= maxAllowedQuantity || isOutOfStock}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <span className="block text-xs text-slate-500 uppercase tracking-wider">
                  Total desta seleção
                </span>
                <div className="font-serif text-2xl font-bold text-slate-900">
                  {formatCurrency(totalPrice)}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="product-add-to-cart-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : addedNotice
                    ? 'bg-emerald-700 text-white shadow-emerald-700/30'
                    : 'bg-emerald-50 border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-700'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    Adicionado ao Carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>

              <button
                id="product-buy-now-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="py-3.5 px-5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Comprar Agora
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Opção de faturamento com Nota Fiscal (7%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Embalagem reforçada anti-impacto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Você Também Pode Gostar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
