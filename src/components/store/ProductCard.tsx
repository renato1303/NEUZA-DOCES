import React, { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
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

  const isOutOfStock = product.stock <= 0;

  const isBombocado =
    product.id === 'prod-bombocado' ||
    product.slug.includes('bombocado') ||
    product.name.toLowerCase().includes('bombocado');
  const unitsInPote = isBombocado ? 18 : 20;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedFormat, 1);
    onNavigate('/carrinho');
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
      <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-50/80 to-slate-100/60 p-5 sm:p-6 flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain object-center drop-shadow-xs group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-[#091129]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" /> Ver detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Product Name */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-950 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Format Selector: Pote vs Caixa */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormat('pote');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all text-center leading-tight ${
                selectedFormat === 'pote'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="block text-[11px]">Preço por pote varejo</span>
              <span className="font-bold text-xs">({formatCurrency(product.price_unit)})</span>
              <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                Pote com {unitsInPote} unidades
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormat('caixa');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all text-center leading-tight ${
                selectedFormat === 'caixa'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="block text-[11px]">Preço por caixa atacado</span>
              <span className="font-bold text-xs">({formatCurrency(product.price_box)})</span>
              <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                Caixa com 6 potes
              </span>
            </button>
          </div>

          {/* Pricing display & Action button */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block leading-none mb-1">
                {selectedFormat === 'caixa' ? 'Preço por caixa atacado' : 'Preço por pote varejo'}
              </span>
              <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-none">
                {formatCurrency(activePrice)}
              </div>
              <span className="text-[11px] text-blue-900 font-medium block mt-1">
                {selectedFormat === 'caixa'
                  ? 'Caixa com 6 potes'
                  : `Pote com ${unitsInPote} unidades`}
              </span>
            </div>

            <button
              type="button"
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
