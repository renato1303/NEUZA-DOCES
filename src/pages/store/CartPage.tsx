import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotalItems,
    settings,
  } = useStore();

  const freeShippingThreshold = settings.free_shipping_threshold || 300;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-900">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Seu carrinho está vazio
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Explore nossa seleção de doces caseiros e tradicionais da Neuza Doces para encher seu carrinho!
          </p>
        </div>
        <button
          onClick={() => onNavigate('/produtos')}
          className="px-8 py-3.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Explorar Catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Carrinho de Compras
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Você tem <strong>{cartTotalItems}</strong> {cartTotalItems === 1 ? 'item' : 'itens'} no carrinho.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline self-start sm:self-auto"
        >
          Esvaziar carrinho
        </button>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-blue-950">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-900" />
            <span>
              {remainingForFreeShipping > 0
                ? `Faltam ${formatCurrency(remainingForFreeShipping)} para você ganhar Frete Grátis!`
                : 'Parabéns! Você atingiu o valor para Frete Grátis!'}
            </span>
          </div>
          <span>{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#101e4a] transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items list + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {cart.map((item) => {
              const itemPrice =
                item.sale_type === 'caixa' ? item.product.price_box : item.product.price_unit;
              const lineTotal = itemPrice * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.sale_type}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & details */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-950">
                          {item.sale_type === 'caixa' ? 'Caixa (1X6)' : 'Pote Individual'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.product.weight}
                        </span>
                      </div>
                      <h3
                        onClick={() => onNavigate(`/produto/${item.product.slug}`)}
                        className="font-serif font-bold text-slate-900 hover:text-blue-900 transition-colors cursor-pointer text-base"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.sale_type === 'caixa'
                          ? `Contém ${item.product.units_per_box} potes de ${item.product.weight}`
                          : `Preço unitário: ${formatCurrency(itemPrice)}`}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity counter */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.sale_type, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.sale_type, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[90px]">
                      <span className="block text-xs text-slate-400">Total</span>
                      <span className="font-serif font-bold text-base text-slate-900">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.sale_type)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('/produtos')}
            className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5 pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando mais doces
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal dos itens</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Frete estimado</span>
                  {remainingForFreeShipping <= 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      GRÁTIS
                    </span>
                  )}
                </span>
                <span className="font-semibold text-slate-900">
                  {remainingForFreeShipping <= 0
                    ? 'Grátis'
                    : formatCurrency(settings.flat_shipping_fee || 15)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  Nota Fiscal no Checkout
                </div>
                <p>
                  Você poderá solicitar emissão de Nota Fiscal (acréscimo comercial de {settings.invoice_fee_percentage}%)
                  na próxima etapa.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-blue-950">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => onNavigate('/checkout')}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Avançar para Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Pagamento 100% seguro via Pix ou Cartão
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
