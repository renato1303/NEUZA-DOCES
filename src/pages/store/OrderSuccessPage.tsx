import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  MapPin,
  Phone,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId || o.order_number === orderId);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#091129', '#1b2c6f', '#d6bd2d', '#25D366'],
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
          className="px-6 py-2.5 rounded-xl bg-[#101e4a] text-white font-semibold text-sm hover:bg-[#192f75] transition-colors cursor-pointer"
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
    const itemsFormatted = order.items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product_name} (${item.sale_type === 'caixa' ? 'Caixa' : 'Pote'}) - ${formatCurrency(
            item.subtotal
          )}`
      )
      .join('\n');

    const complementText = order.address.complement ? ` - Compl: ${order.address.complement}` : '';
    const docText =
      order.customer.document && order.customer.document !== 'Não informado'
        ? order.customer.document
        : 'Não informado';
    const notesText = order.notes && order.notes.trim() ? order.notes.trim() : 'Nenhuma';

    const message = [
      `🍬 *NOVO PEDIDO - NEUZA DOCES*`,
      `*Pedido:* #${order.order_number}`,
      ``,
      `👤 *DADOS DO COMPRADOR / EMPRESA:*`,
      `• *Nome/Razão Social:* ${order.customer.name}`,
      `• *E-mail:* ${order.customer.email}`,
      `• *WhatsApp/Telefone:* ${order.customer.phone}`,
      `• *CPF/CNPJ:* ${docText}`,
      ``,
      `📍 *ENDEREÇO DE ENTREGA:*`,
      `• *Logradouro:* ${order.address.street}, Nº ${order.address.number}${complementText}`,
      `• *Bairro:* ${order.address.neighborhood || 'Centro'}`,
      `• *Cidade/UF:* ${order.address.city}/${order.address.state}`,
      `• *CEP:* ${order.address.zip_code}`,
      ``,
      `📝 *OBSERVAÇÃO:*`,
      `${notesText}`,
      ``,
      `📦 *ITENS DO PEDIDO:*`,
      `${itemsFormatted}`,
      ``,
      `💰 *VALOR TOTAL DO PEDIDO:* ${formatCurrency(order.total)}`,
      `*(Frete a calcular com o nosso time comercial)*`,
      ``,
      `Olá! Acabei de fazer este pedido no site e gostaria de falar com o time comercial para calcular o frete e finalizar minha compra!`
    ].join('\n');

    window.open(`https://wa.me/5515991576707?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Thank You / Order Received Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-md text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Obrigado pelo seu pedido
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Muito obrigado pela sua compra!
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto pt-1 leading-relaxed">
            Seu pedido foi registrado com sucesso na fábrica <strong>Neuza Doces</strong>. O valor do frete não é cobrado pelo sistema: nossa equipe comercial calculará o frete de forma personalizada para a sua localidade.
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

      {/* Commercial Team Next Step Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Próximo Passo
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Finalização e cálculo do frete com nosso time comercial
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Nossa equipe já recebeu os seus dados e o pedido de doces. Clique no botão abaixo para conversar no WhatsApp com nossa equipe comercial e obter o cálculo exato do frete.
            </p>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto shrink-0 py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Falar no WhatsApp (15 99157-6707)</span>
          </button>
        </div>
      </div>

      {/* Order Progress Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-900">Etapas do Pedido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
            <span className="block font-bold">1. Recebido</span>
            <span className="text-[11px] text-emerald-700">Pedido gravado</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
            <span className="block font-bold">2. Frete</span>
            <span className="text-[11px] text-amber-700">Cálculo no WhatsApp</span>
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
              Dados do Comprador / Empresa
            </h3>
            <p className="font-semibold text-slate-900 text-sm">{order.customer.name}</p>
            <p>E-mail: {order.customer.email}</p>
            <p>Telefone / WhatsApp: {order.customer.phone}</p>
            {order.customer.document && order.customer.document !== 'Não informado' && (
              <p>Documento: {order.customer.document}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-900" />
              Endereço de Entrega
            </h3>
            <p className="font-medium text-slate-900">
              {order.address.street}, Nº {order.address.number}
              {order.address.complement && ` - ${order.address.complement}`}
            </p>
            <p>
              {order.address.neighborhood} - {order.address.city}/{order.address.state}
            </p>
            <p>CEP: {order.address.zip_code}</p>
          </div>
        </div>

        {/* Notes (if any) */}
        {order.notes && order.notes.trim() && (
          <div className="p-6 bg-slate-50/50 text-xs text-slate-600 space-y-1">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Observações do Pedido:
            </h4>
            <p className="italic text-slate-700">{order.notes}</p>
          </div>
        )}

        {/* Ordered Items Table */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Produtos Selecionados ({order.items.length})
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

          <div className="flex justify-between items-center text-slate-600">
            <span>Frete</span>
            <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              A calcular com o time comercial
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <div>
              <span className="font-bold text-slate-900 text-base">Valor dos Produtos</span>
              <span className="block text-[11px] text-slate-500 font-normal">
                (Frete a ser informado pelo atendimento via WhatsApp)
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-blue-950">
              {formatCurrency(order.subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprovante
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/produtos')}
            className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Continuar Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
