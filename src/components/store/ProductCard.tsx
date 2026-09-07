import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, SaleType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useStore();
  const [selectedFormat, setSelectedFormat] = useState<SaleType>('pote');
  const [addedNotice, setAddedNotice] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedFormat, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const handleCardClick = () => {
    onNavigate(`/produto/${product.slug}`);
  };

  const activePrice =
    selectedFormat === 'caixa' ? product.price_box : product.price_unit;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-60 bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Out of stock badge only */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-[#091129]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" /> Ver detalhes
          </span>
        </div>
      </div>

      {/* Content: Apenas Preço e Ações de Compra */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-end">
        {/* Format Selector: Pote vs Caixa */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormat('pote');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                selectedFormat === 'pote'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pote ({formatCurrency(product.price_unit)})
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormat('caixa');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                selectedFormat === 'caixa'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Caixa ({formatCurrency(product.price_box)})
            </button>
          </div>

          {/* Pricing display & Action button */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block leading-none mb-1">
                {selectedFormat === 'caixa' ? 'Preço da Caixa' : 'Preço do Pote'}
              </span>
              <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                {formatCurrency(activePrice)}
              </div>
            </div>

            <button
              type="button"
              id={`add-to-cart-${product.id}`}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : addedNotice
                  ? 'bg-emerald-700 text-white shadow-emerald-700/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
