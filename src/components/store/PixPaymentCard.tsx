import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Share2,
} from 'lucide-react';
import { generatePixPayload, generatePixQrDataUrl } from '../../utils/pix';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface PixPaymentCardProps {
  orderNumber: string;
  total: number;
  customerName?: string;
  onPaymentConfirmed?: () => void;
  compact?: boolean;
}

export const PixPaymentCard: React.FC<PixPaymentCardProps> = ({
  orderNumber,
  total,
  customerName,
  onPaymentConfirmed,
  compact = false,
}) => {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes expiration

  const pixKey = settings.pix_key || 'renatoinacio2@gmail.com';
  const merchantName = settings.store_name || 'NEUZA DOCES';
  const merchantCity = settings.city || 'VALINHOS';

  useEffect(() => {
    // Generate official payload and QR code
    const payload = generatePixPayload({
      pixKey,
      merchantName,
      merchantCity,
      amount: total,
      txId: orderNumber.replace(/[^a-zA-Z0-9]/g, '') || 'NEUZA',
      description: `Pedido ${orderNumber}`,
    });

    setPixCode(payload);

    generatePixQrDataUrl(payload).then((url) => {
      setQrDataUrl(url);
    });
  }, [pixKey, merchantName, merchantCity, total, orderNumber]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmSimulation = () => {
    setIsPaid(true);
    if (onPaymentConfirmed) {
      onPaymentConfirmed();
    }
  };

  const handleSendWhatsAppProof = () => {
    const phone = (settings.whatsapp || settings.phone || '').replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Olá! Acabei de realizar o pagamento via Pix do Pedido #${orderNumber} no valor de ${formatCurrency(
        total
      )}. Segue o comprovante de pagamento!`
    );
    const url = phone ? `https://wa.me/55${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  };

  if (isPaid) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            Pagamento Identificado
          </span>
          <h3 className="font-serif text-2xl font-bold text-emerald-950">
            Pix Confirmado com Sucesso!
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            O valor de <strong>{formatCurrency(total)}</strong> para o pedido{' '}
            <strong>{orderNumber}</strong> foi validado. Nossos doceiros já iniciaram a separação dos
            seus doces!
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={handleSendWhatsAppProof}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Enviar Comprovante no WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-[#101e4a]/20 shadow-md overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#101e4a] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
              Pagamento Instantâneo via Pix
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Escaneie o QR Code ou Copie o Código
            </h3>
          </div>
        </div>

        <div className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 text-xs text-emerald-300">
          <Clock className="w-4 h-4" />
          <span>Expira em: <strong className="font-mono text-white">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: QR Code Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code Pix"
                className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                Gerando QR Code...
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center p-1.5">
                <span className="font-bold text-[10px] text-[#101e4a] tracking-tighter uppercase font-serif">
                  PIX
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chave Segura Banco Central do Brasil</span>
          </div>
        </div>

        {/* Right Column: Values, Copia e Cola, and Instructions */}
        <div className="md:col-span-7 space-y-5">
          {/* Amount Badge */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                Valor Exato dos Produtos
              </span>
              <span className="font-serif text-3xl font-bold text-[#101e4a]">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="text-right text-xs text-slate-600">
              <span className="block font-medium">Beneficiário:</span>
              <strong className="text-slate-900 block">{merchantName}</strong>
              <span className="text-[11px] text-slate-500 font-mono">Chave: {pixKey}</span>
            </div>
          </div>

          {/* Pix Copia e Cola Input and Copy Button */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Pix Copia e Cola (para pagar pelo aplicativo do banco):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={pixCode}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-600 truncate select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#101e4a] hover:bg-[#182e6d] text-white shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-medium animate-in fade-in">
                Código Pix copiado para a área de transferência! Abra o app do seu banco e cole.
              </p>
            )}
          </div>

          {/* Instructions Step by Step */}
          <div className="space-y-2 pt-1 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
              Como pagar:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#101e4a] block mb-0.5">1. Abra o app</span>
                <span>Acesse o app do seu banco e vá na seção <strong>Pix</strong>.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#101e4a] block mb-0.5">2. Pagar / QR Code</span>
                <span>Escolha <strong>Ler QR Code</strong> ou <strong>Pix Copia e Cola</strong>.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#101e4a] block mb-0.5">3. Confirme</span>
                <span>Verifique o valor de <strong>{formatCurrency(total)}</strong> e confirme.</span>
              </div>
            </div>
          </div>

          {/* Actions: Confirm Payment simulation or WhatsApp Proof */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSendWhatsAppProof}
              className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar Comprovante via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmSimulation}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Já realizei o pagamento (Confirmar)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
