import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  X,
  Loader2,
  Search,
  Check,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { Order } from '../../types';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, cartSubtotal, createOrder } = useStore();

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDocument, setCustomerDocument] = useState('');

  // Address form state
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cepMessage, setCepMessage] = useState('');

  const numberInputRef = useRef<HTMLInputElement>(null);

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const fetchAddressByCep = async (rawCep: string) => {
    const cleanCep = rawCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    setCepStatus('loading');
    setCepMessage('Buscando endereço...');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (!response.ok) throw new Error('Falha ao consultar CEP');
      const data = await response.json();

      if (data.erro) {
        setCepStatus('error');
        setCepMessage('CEP não encontrado. Por favor, preencha o endereço manualmente.');
        return;
      }

      if (data.logradouro) setStreet(data.logradouro);
      if (data.bairro) setNeighborhood(data.bairro);
      if (data.localidade) setCity(data.localidade);
      if (data.uf) setState(data.uf);

      setCepStatus('success');
      setCepMessage('Endereço localizado! Informe agora o número e o complemento.');

      // Automatically focus on the number input field so the user only needs to type number and complement
      setTimeout(() => {
        numberInputRef.current?.focus();
      }, 100);
    } catch {
      setCepStatus('error');
      setCepMessage('Não foi possível buscar o endereço automaticamente. Preencha manualmente.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setZipCode(formatted);
    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      fetchAddressByCep(clean);
    } else {
      setCepStatus('idle');
      setCepMessage('');
    }
  };

  const handleZipCodeBlur = () => {
    const clean = zipCode.replace(/\D/g, '');
    if (clean.length === 8 && cepStatus === 'idle') {
      fetchAddressByCep(clean);
    }
  };

  // Notes & Submission
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Commercial Team WhatsApp Modal
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-800">
          Você não tem produtos para finalizar
        </h2>
        <p className="text-sm text-slate-500">
          Adicione doces ao seu carrinho antes de prosseguir para o checkout.
        </p>
        <button
          onClick={() => onNavigate('/produtos')}
          className="px-6 py-2.5 rounded-xl bg-[#101e4a] text-white font-semibold text-sm hover:bg-[#192f75] transition-colors"
        >
          Ir para o Catálogo
        </button>
      </div>
    );
  }

  const orderTotal = cartSubtotal;

  const buildWhatsAppUrl = (order: Order) => {
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

    return `https://wa.me/5515991576707?text=${encodeURIComponent(message)}`;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor, preencha todos os dados pessoais obrigatórios.');
      return;
    }

    if (!street.trim() || !number.trim() || !city.trim()) {
      setErrorMessage('Por favor, informe o endereço completo para entrega.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          document: customerDocument.trim() || 'Não informado',
        },
        address: {
          zip_code: zipCode.trim() || '00000-000',
          street: street.trim(),
          number: number.trim(),
          complement: complement.trim(),
          neighborhood: neighborhood.trim() || 'Centro',
          city: city.trim(),
          state: state.trim() || 'SP',
        },
        items: cart.map((c) => ({
          product: c.product,
          sale_type: c.sale_type,
          quantity: c.quantity,
        })),
        payment_method: 'pix',
        has_invoice: false,
        notes: notes.trim(),
      });

      // Save order and pop up the commercial WhatsApp modal
      setCompletedOrder(order);
      setShowWhatsAppModal(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar o pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Checkout Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={() => onNavigate('/carrinho')}
            className="text-xs text-slate-500 hover:text-blue-900 flex items-center gap-1.5 mb-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o carrinho
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Finalizar Compra
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Ambiente seguro • Pedido registrado diretamente na fábrica Neuza Doces
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Dados do Cliente */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#101e4a] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Dados do Comprador / Empresa
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo ou Razão Social *
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="Ex: João Silva ou Mercado Central LTDA"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail para confirmação *
                </label>
                <input
                  id="checkout-email-input"
                  type="email"
                  required
                  placeholder="email@exemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder="(11) 98765-4321"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>CPF ou CNPJ (Opcional)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Identificação cadastral</span>
                </label>
                <input
                  id="checkout-doc-input"
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={customerDocument}
                  onChange={(e) => setCustomerDocument(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Endereço de Entrega */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#101e4a] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-lg font-bold text-slate-900">Endereço de Entrega</h2>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Preenchimento automático via CEP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CEP Input with search state and feedback */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>CEP *</span>
                  {isLoadingCep ? (
                    <span className="text-[11px] text-blue-900 font-semibold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Consultando...
                    </span>
                  ) : cepStatus === 'success' ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Localizado!
                    </span>
                  ) : null}
                </label>
                <div className="relative">
                  <input
                    id="checkout-cep-input"
                    type="text"
                    required
                    placeholder="00000-000"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    onBlur={handleZipCodeBlur}
                    maxLength={9}
                    className={`w-full pl-3.5 pr-9 py-2.5 rounded-xl border text-sm outline-hidden transition-all ${
                      cepStatus === 'success'
                        ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:ring-2 focus:ring-emerald-500'
                        : cepStatus === 'error'
                        ? 'border-rose-400 bg-rose-50/20 text-slate-900 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    {isLoadingCep ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                    ) : cepStatus === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    ) : (
                      <Search className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Rua / Avenida */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Rua / Logradouro *</span>
                  {cepStatus === 'success' && (
                    <span className="text-[11px] text-emerald-600 font-medium">Preenchido automaticamente</span>
                  )}
                </label>
                <input
                  id="checkout-street-input"
                  type="text"
                  required
                  placeholder="Ex: Rua das Palmeiras"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Status Banner when CEP is loaded or failed */}
              {cepMessage && (
                <div
                  className={`sm:col-span-3 text-xs flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    cepStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {cepStatus === 'success' ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  )}
                  <span>{cepMessage}</span>
                </div>
              )}

              {/* Número: Main focus target after CEP lookup */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Número *</span>
                  <span className="text-[10px] text-amber-700 font-bold uppercase bg-amber-50 px-1.5 py-0.5 rounded">Adicionar</span>
                </label>
                <input
                  ref={numberInputRef}
                  id="checkout-number-input"
                  type="text"
                  required
                  placeholder="Ex: 123 ou S/N"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
                />
              </div>

              {/* Complemento: Main optional addition */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Complemento</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
                </label>
                <input
                  id="checkout-complement-input"
                  type="text"
                  placeholder="Apto, Galpão, Sala..."
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro *</label>
                <input
                  id="checkout-neighborhood-input"
                  type="text"
                  required
                  placeholder="Bairro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Cidade */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade *</label>
                <input
                  id="checkout-city-input"
                  type="text"
                  required
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Estado (UF) with all 27 Brazilian UFs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estado (UF) *</label>
                <select
                  id="checkout-state-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-medium"
                >
                  {BRAZILIAN_STATES.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Observações do Pedido */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Observações do Pedido (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Instruções de entrega, referências ou horário preferencial..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
              Itens do Pedido ({cart.length})
            </h2>

            {/* Product list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {cart.map((item) => {
                const itemPrice =
                  item.sale_type === 'caixa' ? item.product.price_box : item.product.price_unit;
                return (
                  <div
                    key={`${item.product.id}-${item.sale_type}`}
                    className="pt-2 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {item.quantity}x {item.sale_type === 'caixa' ? 'Caixa' : 'Pote'} (
                          {formatCurrency(itemPrice)})
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(itemPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial Calculations Breakdown */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal dos Produtos</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="block text-base font-bold text-slate-900">Valor Total</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Frete a calcular com o atendente)
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-blue-950">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              id="confirm-order-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{isSubmitting ? 'Confirmando...' : 'confirmar e calcular o frete'}</span>
            </button>

            <div className="pt-1 text-center text-xs text-slate-400">
              Ao confirmar, seu pedido é registrado e nossa equipe entrará em contato para o cálculo do frete.
            </div>
          </div>
        </div>
      </form>

      {/* Pop-up Modal: Fale com nosso time comercial */}
      {showWhatsAppModal && completedOrder && (
        <div
          id="commercial-whatsapp-modal"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Close button */}
            <button
              onClick={() => {
                setShowWhatsAppModal(false);
                onNavigate(`/obrigado/${completedOrder.id}`);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Fechar e ir para a página de obrigado"
            >
              <X className="w-5 h-5" />
            </button>

            {/* WhatsApp Icon Circle */}
            <div className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto shadow-inner">
              <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/40">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
            </div>

            {/* Exact Required Message */}
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Para finalizar a sua compra fale agora com nosso time comercial
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Pedido <span className="font-bold text-slate-900">#{completedOrder.order_number}</span> gerado com sucesso. Clique no botão abaixo para abrir o WhatsApp e enviar os detalhes da compra e entrega diretamente para calcularmos o seu frete:
              </p>
            </div>

            {/* WhatsApp Button Directed to 15991576707, then navigates to thank you page */}
            <div>
              <button
                id="modal-whatsapp-button"
                type="button"
                onClick={() => {
                  window.open(buildWhatsAppUrl(completedOrder), '_blank');
                  setShowWhatsAppModal(false);
                  onNavigate(`/obrigado/${completedOrder.id}`);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#25D366]/35 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Falar no WhatsApp (15 99157-6707)</span>
              </button>
            </div>

            {/* Quick Order Breakdown in Modal */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Comprador:</span>
                <span className="font-medium text-slate-900 truncate max-w-[220px]">{completedOrder.customer.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Destino:</span>
                <span className="font-medium text-slate-900 truncate max-w-[220px]">
                  {completedOrder.address.city}/{completedOrder.address.state} • CEP {completedOrder.address.zip_code}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Total dos Produtos:</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrency(completedOrder.total)}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 text-center">
                Todos os itens e dados acima serão enviados automaticamente no WhatsApp.
              </div>
            </div>

            {/* Secondary navigation actions */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowWhatsAppModal(false);
                  onNavigate(`/obrigado/${completedOrder.id}`);
                }}
                className="text-xs text-slate-500 hover:text-blue-900 underline font-medium cursor-pointer"
              >
                Ir para a página de obrigado do pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
