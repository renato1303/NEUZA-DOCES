import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Printer,
  Share2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';
import { PixPaymentCard } from '../../components/store/PixPaymentCard';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { orders, updateOrderStatus } = useStore();

  const order = orders.find((o) => o.id === orderId || o.order_number === orderId);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#091129', '#1b2c6f', '#d6bd2d', '#357fc2'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-800">Pedido não encontrado</h2>
        <p className="text-sm text-slate-500">
          Não localizamos os detalhes deste pedido em nossa base de dados.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 rounded-xl bg-[#101e4a] text-white font-semibold text-sm hover:bg-[#192f75] transition-colors"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Realizei o pedido #${order.order_number} na Neuza Doces no valor de ${formatCurrency(
        order.total
      )}. Aguardo a confirmação de envio!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Success Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-md text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
            Confirmação de Compra
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto pt-1">
            Agradecemos por escolher a <strong>Neuza Doces</strong>. Seu pedido foi encaminhado para a
            nossa equipe de produção e expedição.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 font-bold font-mono">
            {order.order_number}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{formatDateTime(order.created_at)}</span>
          <span className="text-slate-400">•</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Pix Payment Dynamic Section */}
      {order.payment_method === 'pix' && (
        <PixPaymentCard
          orderNumber={order.order_number}
          total={order.total}
          customerName={order.customer.name}
          onPaymentConfirmed={() => {
            updateOrderStatus(order.id, 'confirmado');
          }}
        />
      )}

      {/* Order Progress Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-900">Status do Pedido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
            <span className="block font-bold">1. Recebido</span>
            <span className="text-[11px] text-emerald-700">Pedido gravado</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-medium">
            <span className="block font-bold">2. Confirmação</span>
            <span className="text-[11px] text-blue-700">Validação financeira</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            <span className="block font-bold">3. Preparação</span>
            <span className="text-[11px] text-slate-400">Separação dos doces</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            <span className="block font-bold">4. Embalado</span>
            <span className="text-[11px] text-slate-400">Pronto p/ despacho</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium col-span-2 sm:col-span-1">
            <span className="block font-bold">5. Entregue</span>
            <span className="text-[11px] text-slate-400">Entrega finalizada</span>
          </div>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
        {/* Customer & Address Information */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-900" />
              Dados do Cliente
            </h3>
            <p className="font-semibold text-slate-900 text-sm">{order.customer.name}</p>
            <p>E-mail: {order.customer.email}</p>
            <p>Telefone: {order.customer.phone}</p>
            {order.customer.document && <p>CPF/CNPJ: {order.customer.document}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-900" />
              Endereço de Entrega
            </h3>
            <p className="font-medium text-slate-900">
              {order.address.street}, {order.address.number}
              {order.address.complement && ` - ${order.address.complement}`}
            </p>
            <p>
              {order.address.neighborhood} - {order.address.city}/{order.address.state}
            </p>
            <p>CEP: {order.address.zip_code}</p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Produtos do Pedido ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between text-xs gap-4"
              >
                <div className="flex items-center gap-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.product_name}</h4>
                    <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-950 text-[10px] font-bold uppercase">
                        {item.sale_type === 'caixa' ? 'Caixa (1X6)' : 'Pote Individual'}
                      </span>
                      <span>
                        {item.quantity} un x {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-serif font-bold text-slate-900 text-sm">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Calculation Snapshot */}
        <div className="p-6 bg-slate-50/70 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal dos Produtos</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          {order.has_invoice && (
            <div className="flex justify-between items-center text-blue-950 font-semibold bg-blue-50 p-2 rounded-lg border border-blue-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                Acréscimo de Nota Fiscal ({order.invoice_fee_percentage}%)
              </span>
              <span>+{formatCurrency(order.invoice_fee_amount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Frete</span>
            <span className="font-semibold text-slate-900">
              {order.shipping === 0 ? 'Grátis' : formatCurrency(order.shipping)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Forma de Pagamento</span>
            <span className="font-semibold text-slate-900 uppercase">
              {order.payment_method.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <div>
              <span className="font-bold text-slate-900 text-base">Total do Pedido</span>
              {order.has_invoice && (
                <span className="block text-[11px] text-blue-900 font-medium">
                  Com Nota Fiscal ({order.invoice_fee_percentage}%) inclusa
                </span>
              )}
            </div>
            <span className="font-serif text-3xl font-bold text-blue-950">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprovante
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Enviar no WhatsApp
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/produtos')}
            className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Continuar Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/admin')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Ver no Painel
          </button>
        </div>
      </div>
    </div>
  );
};
