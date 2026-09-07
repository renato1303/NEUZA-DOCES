import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Store,
  ShieldCheck,
  Truck,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useStore();

  const [storeName, setStoreName] = useState(settings.store_name);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [cnpj, setCnpj] = useState(settings.cnpj);
  const [pixKey, setPixKey] = useState(settings.pix_key || 'renatoinacio2@gmail.com');
  const [invoiceFeePercentage, setInvoiceFeePercentage] = useState(
    String(settings.invoice_fee_percentage)
  );
  const [flatShippingFee, setFlatShippingFee] = useState(String(settings.flat_shipping_fee));
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    String(settings.free_shipping_threshold)
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      store_name: storeName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      address: address.trim(),
      cnpj: cnpj.trim(),
      pix_key: pixKey.trim(),
      invoice_fee_percentage: parseFloat(invoiceFeePercentage) || 7,
      flat_shipping_fee: parseFloat(flatShippingFee) || 15,
      free_shipping_threshold: parseFloat(freeShippingThreshold) || 300,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (
      confirm(
        'Tem certeza que deseja restaurar todos os dados de demonstração (produtos, categorias e pedidos iniciais)? Todas as alterações recentes serão redefinidas.'
      )
    ) {
      resetToDemoData();
      alert('Dados restaurados para a demonstração original!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Configurações da Loja & Regras Comerciais
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Parâmetros operacionais, alíquota de Nota Fiscal ({invoiceFeePercentage}%) e regras de frete.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Configurações atualizadas e aplicadas com sucesso em todo o sistema!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Card 1: Identidade da Marca e Dados Cadastrais */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4 h-4 text-blue-900" />
            <h2 className="font-serif text-base font-bold text-slate-900">
              Dados Cadastrais da Empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Fantasia da Loja</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">E-mail Comercial</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Endereço da Fábrica</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Regra de Nota Fiscal (7%) */}
        <div className="bg-blue-50/60 p-6 rounded-2xl border-2 border-blue-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-200/70">
            <ShieldCheck className="w-5 h-5 text-blue-900" />
            <div>
              <h2 className="font-serif text-base font-bold text-blue-950">
                Regra Fiscal de Nota Fiscal
              </h2>
              <span className="text-[11px] text-blue-800">
                Acréscimo automático sobre o subtotal quando o cliente solicita Nota Fiscal
              </span>
            </div>
          </div>

          <div className="max-w-xs space-y-1">
            <label className="block font-bold text-blue-950">
              Percentual de Acréscimo Comercial da NF (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={invoiceFeePercentage}
                onChange={(e) => setInvoiceFeePercentage(e.target.value)}
                className="w-full px-3 py-2 pr-8 rounded-xl border border-blue-300 bg-white font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-blue-800">
                %
              </span>
            </div>
            <p className="text-[11px] text-blue-800/80 pt-1">
              Valor padrão exigido pela regra comercial: <strong>7%</strong>.
            </p>
          </div>
        </div>

        {/* Card: Configuração de Pagamento Pix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900">
                Recebimento via Pix
              </h2>
              <span className="text-[11px] text-slate-500">
                Chave Pix utilizada para gerar os QR Codes dinâmicos com o valor exato dos pedidos dos clientes
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="max-w-md">
              <label className="block font-bold text-slate-700 mb-1">
                Sua Chave Pix (E-mail, CPF/CNPJ, Celular ou Chave Aleatória)
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Ex: seu-email@exemplo.com ou 11985193940"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
              />
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Os clientes verão o QR Code oficial do Banco Central e o Pix Copia e Cola gerados na hora com o valor total exato dos produtos que compraram.
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Parâmetros de Frete */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-4 h-4 text-blue-900" />
            <h2 className="font-serif text-base font-bold text-slate-900">
              Regras de Frete e Despacho
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Frete Fixo Base (R$)
              </label>
              <input
                type="number"
                step="0.5"
                value={flatShippingFee}
                onChange={(e) => setFlatShippingFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Valor Mínimo para Frete Grátis (R$)
              </label>
              <input
                type="number"
                step="10"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Dados de Teste (Reset)</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
