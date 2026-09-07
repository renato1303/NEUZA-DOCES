import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { PaymentMethod } from '../../types';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, cartSubtotal, createOrder, settings } = useStore();

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

  // Commercial & NF rule state
  // CRITICAL REQUIREMENT: Rule 7 & 14 - Option for Nota Fiscal with automatic 7% surcharge
  const [hasInvoice, setHasInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
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

  // Calculations
  const shipping =
    cartSubtotal >= (settings.free_shipping_threshold || 300)
      ? 0
      : settings.flat_shipping_fee || 15;

  const invoiceFeePercentage = settings.invoice_fee_percentage || 7;
  const invoiceFeeAmount = hasInvoice
    ? Math.round(cartSubtotal * (invoiceFeePercentage / 100) * 100) / 100
    : 0;

  const orderTotal = Math.round((cartSubtotal + shipping + invoiceFeeAmount) * 100) / 100;

  const handleFillDemoData = () => {
    setCustomerName('Confeitaria Sabor Mineiro LTDA');
    setCustomerEmail('contato@sabormineiro.com.br');
    setCustomerPhone('(19) 98765-4321');
    setCustomerDocument('23.841.902/0001-55');
    setZipCode('13010-000');
    setStreet('Avenida Francisco Glicério');
    setNumber('1240');
    setComplement('Loja 02');
    setNeighborhood('Centro');
    setCity('Campinas');
    setState('SP');
    setHasInvoice(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor, preencha todos os dados pessoais obrigatórios.');
      return;
    }

    if (hasInvoice && !customerDocument.trim()) {
      setErrorMessage('O preenchimento do CPF/CNPJ é obrigatório para emissão de Nota Fiscal.');
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
        payment_method: paymentMethod,
        has_invoice: hasInvoice,
        notes: notes.trim(),
      });

      // Navigate to order confirmation
      onNavigate(`/pedido/${order.id}`);
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

        {/* Demo filler button */}
        <button
          type="button"
          onClick={handleFillDemoData}
          className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold transition-colors border border-blue-200"
        >
          Preencher dados de exemplo (Teste rápido)
        </button>
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
                  <span>CPF ou CNPJ {hasInvoice && <strong className="text-blue-900">(Obrigatório para NF)</strong>}</span>
                  <span className="text-[11px] text-slate-400 font-normal">Identificação fiscal</span>
                </label>
                <input
                  id="checkout-doc-input"
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={customerDocument}
                  onChange={(e) => setCustomerDocument(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden ${
                    hasInvoice && !customerDocument ? 'border-amber-500 bg-amber-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Endereço de Entrega */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#101e4a] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900">Endereço de Entrega</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  placeholder="13000-000"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rua / Avenida *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua das Palmeiras"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Número *</label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Complemento</label>
                <input
                  type="text"
                  placeholder="Apto / Galpão / Sala"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estado (UF) *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                >
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                  <option value="RJ">RJ</option>
                  <option value="PR">PR</option>
                  <option value="SC">SC</option>
                  <option value="RS">RS</option>
                  <option value="BA">BA</option>
                  <option value="GO">GO</option>
                  <option value="ES">ES</option>
                  <option value="DF">DF</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: REGRA FISCAL DE NOTA FISCAL */}
          <div className="bg-blue-50/70 p-6 rounded-2xl border-2 border-blue-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                <h2 className="font-serif text-lg font-bold text-blue-950">
                  Emissão de Nota Fiscal
                </h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80">
                Regra Comercial (+{invoiceFeePercentage}%)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Conforme a regra comercial e tributária da <strong>Neuza Doces</strong>, pedidos com
              emissão de Nota Fiscal possuem um acréscimo de{' '}
              <strong>{invoiceFeePercentage}%</strong> sobre o subtotal dos produtos.
            </p>

            {/* Option selector: Não / Sim */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                id="invoice-option-no"
                onClick={() => setHasInvoice(false)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 ${
                  !hasInvoice
                    ? 'bg-white border-[#101e4a] text-[#091129] shadow-xs font-bold'
                    : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>Não preciso de NF</span>
              </button>

              <button
                type="button"
                id="invoice-option-yes"
                onClick={() => setHasInvoice(true)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 ${
                  hasInvoice
                    ? 'bg-[#101e4a] border-[#091129] text-white shadow-md font-bold'
                    : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span>Sim, emitir NF (+{invoiceFeePercentage}%)</span>
              </button>
            </div>

            {hasInvoice && (
              <div className="p-3 bg-white/90 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Nota Fiscal solicitada com sucesso!
                </div>
                <p>
                  Acréscimo de {invoiceFeePercentage}%:{' '}
                  <strong>{formatCurrency(invoiceFeeAmount)}</strong> calculado e somado ao total.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Forma de Pagamento */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#101e4a] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900">Forma de Pagamento</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#101e4a] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={() => setPaymentMethod('pix')}
                  className="accent-[#101e4a]"
                />
                <QrCode className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Pix Instantâneo</span>
                  <span className="block text-[11px] text-slate-500">Aprovação imediata</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cartao_credito'
                    ? 'border-[#101e4a] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cartao_credito"
                  checked={paymentMethod === 'cartao_credito'}
                  onChange={() => setPaymentMethod('cartao_credito')}
                  className="accent-[#101e4a]"
                />
                <CreditCard className="w-5 h-5 text-blue-800" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Cartão de Crédito</span>
                  <span className="block text-[11px] text-slate-500">Em até 6x sem juros</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cartao_debito'
                    ? 'border-[#101e4a] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cartao_debito"
                  checked={paymentMethod === 'cartao_debito'}
                  onChange={() => setPaymentMethod('cartao_debito')}
                  className="accent-[#101e4a]"
                />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Cartão de Débito</span>
                  <span className="block text-[11px] text-slate-500">Direto na entrega/online</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'dinheiro'
                    ? 'border-[#101e4a] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="dinheiro"
                  checked={paymentMethod === 'dinheiro'}
                  onChange={() => setPaymentMethod('dinheiro')}
                  className="accent-[#101e4a]"
                />
                <Banknote className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Dinheiro na Entrega</span>
                  <span className="block text-[11px] text-slate-500">Pagamento no recebimento</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'pix' && (
              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <QrCode className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-emerald-900">QR Code Pix Instantâneo</strong>
                  <span>
                    Ao finalizar o pedido, o QR Code dinâmico será gerado na hora com o valor total exato dos seus produtos ({formatCurrency(orderTotal)}) e a opção Pix Copia e Cola para pagar pelo aplicativo do seu banco.
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observações do Pedido (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Instruções de entrega, referências ou horário preferencial..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
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
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              {/* Explicit NF surcharge line as requested in Section 7 */}
              {hasInvoice && (
                <div className="flex justify-between items-center text-blue-950 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
                  <span className="font-semibold flex items-center gap-1 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                    Acréscimo NF ({invoiceFeePercentage}%)
                  </span>
                  <span className="font-bold text-xs">
                    +{formatCurrency(invoiceFeeAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Frete</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-bold">Grátis</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="block text-base font-bold text-slate-900">Valor Total</span>
                  {hasInvoice && (
                    <span className="text-[11px] text-blue-900 font-medium">
                      (Com emissão fiscal inclusa)
                    </span>
                  )}
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
              <span>{isSubmitting ? 'Registrando Pedido...' : 'Confirmar e Finalizar Pedido'}</span>
            </button>

            <div className="pt-1 text-center text-xs text-slate-400">
              Ao confirmar, seu pedido é processado e enviado para produção.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
