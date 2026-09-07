import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#070e28] text-slate-300 pt-14 pb-8 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Neuza Doces"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Doces artesanais produzidos com carinho e tradição brasileira. Sabores que resgatam
              memórias afetivas e transformam qualquer momento em celebração.
            </p>
            <div className="pt-2 text-xs text-amber-300/90 font-medium">
              Vendas no atacado (caixas fechadas) e no varejo (potes avulsos).
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-amber-300">Navegação Rápida</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-amber-300 hover:translate-x-1 transition-all"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/produtos')}
                  className="hover:text-amber-300 hover:translate-x-1 transition-all"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/categoria/doces-tradicionais')}
                  className="hover:text-amber-300 hover:translate-x-1 transition-all"
                >
                  Doces Tradicionais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/categoria/pacocas-amendoim')}
                  className="hover:text-amber-300 hover:translate-x-1 transition-all"
                >
                  Paçocas & Amendoim
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/carrinho')}
                  className="hover:text-amber-300 hover:translate-x-1 transition-all"
                >
                  Meu Carrinho
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Factory Address */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-amber-300">Fábrica & Vendas</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {settings.street}, {settings.number} - {settings.neighborhood}
                  <br />
                  {settings.city}/{settings.state} - CEP: {settings.zip_code}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.phone} / {settings.whatsapp}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Seg a Sex: 07h às 17h • Sáb: 08h às 12h</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Commercial & Administrative */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-amber-300">Informações Comerciais</h3>
            <div className="bg-[#0b1638] p-3.5 rounded-xl border border-blue-900/60 text-xs text-slate-300 space-y-2 shadow-inner">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Nota Fiscal Disponível
              </div>
              <p className="text-slate-400">
                Opção de faturamento com Nota Fiscal (acréscimo comercial de {settings.invoice_fee_percentage}%)
                para distribuidores, mercados e revendedores.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/admin')}
                className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
              >
                Acesso Restrito do Administrador
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-blue-950 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Neuza Doces. Todos os direitos reservados. CNPJ 18.492.301/0001-44</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Feito com</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>para amantes de doces artesanais brasileiros</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
