import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  ExternalLink, 
  ShoppingBag, 
  Layers, 
  Package, 
  HelpCircle, 
  ShieldCheck, 
  FileCode, 
  Lock, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail,
  Store,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const { products, categories, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);
  const activeCategories = useMemo(() => categories.filter((c) => c.active), [categories]);

  // Filtered lists if search query is active
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return activeProducts;
    const q = searchQuery.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.weight.toLowerCase().includes(q)
    );
  }, [activeProducts, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return activeCategories;
    const q = searchQuery.toLowerCase();
    return activeCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [activeCategories, searchQuery]);

  const institutionalLinks = [
    { title: 'Início / Loja Virtual', path: '/', description: 'Página inicial com destaques e lançamentos de doces artesanais' },
    { title: 'Catálogo Geral de Produtos', path: '/produtos', description: 'Todos os doces Neuza disponíveis por pote e caixa fechada' },
    { title: 'Meu Carrinho de Compras', path: '/carrinho', description: 'Visualizar itens selecionados e estimativa de valores' },
    { title: 'Finalização de Pedido (Checkout)', path: '/checkout', description: 'Confirmação dos dados para atendimento comercial' },
    { title: 'Área Restrita (Painel Administrativo)', path: '/admin/login', description: 'Login restrito para gestores da Neuza Doces e IR Distribuidora' },
  ];

  const commercialInfo = [
    {
      title: 'Atendimento Comercial Direto (WhatsApp)',
      desc: 'Finalize seus pedidos e tire dúvidas com o time comercial: (15) 99157-6707.',
      action: () => window.open('https://wa.me/5515991576707', '_blank'),
      isExternal: true,
    },
    {
      title: 'Tabela Atacado & Varejo',
      desc: 'Compre no varejo (potes avulsos de 600g a 1.4kg) ou atacado (caixas fechadas 1x6 potes).',
      action: () => onNavigate('/produtos'),
      isExternal: false,
    },
    {
      title: 'Cálculo de Frete e Entregas',
      desc: 'O frete é negociado diretamente com nosso time comercial de acordo com a sua região e volume.',
      action: () => onNavigate('/produtos'),
      isExternal: false,
    },
    {
      title: 'Doces Frescos Direto da Fábrica',
      desc: 'Produção artesanal tradicional com receitas de família e embalagens seguras para atacado e varejo.',
      action: () => onNavigate('/produtos'),
      isExternal: false,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-slate-500 gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-amber-700 transition-colors">
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">Mapa do Site</span>
        </nav>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#091129] via-[#0d183d] to-[#091129] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-950 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <Compass className="w-80 h-80 text-amber-300" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-800 text-amber-300 text-xs font-semibold">
              <Compass className="w-4 h-4" />
              <span>Estrutura de Páginas & Índice da Aplicação</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Mapa do Site (Sitemap)
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consulte todo o índice hierárquico de páginas, seções de doces artesanais, categorias de atacado/varejo 
              e canais de atendimento da <strong>Neuza Doces</strong>, distribuído com exclusividade por{' '}
              <strong className="text-amber-300">IR Distribuidora</strong>.
            </p>

            {/* Quick search input & XML link */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar página, doce ou categoria no sitemap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#060c1e]/80 border border-blue-900/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/70 border border-blue-700/60 text-xs font-semibold text-amber-300 transition-colors shrink-0"
              >
                <FileCode className="w-4 h-4" />
                <span>Ver XML (sitemap.xml)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 1: Institutional & Main Navigation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Store className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Navegação Principal da Loja
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionalLinks.map((item) => (
              <div
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {item.path}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-800 group-hover:text-amber-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Categories Directory */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-700" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Linhas & Categorias de Doces ({filteredCategories.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/produtos')}
              className="text-xs font-semibold text-blue-800 hover:text-blue-900 hover:underline"
            >
              Ver todas as categorias →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => {
              const count = activeProducts.filter((p) => p.category_id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(`/categoria/${cat.slug}`)}
                  className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        /categoria/{cat.slug}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {count} produtos
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-800 group-hover:text-blue-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-3 flex items-center text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                    <span>Acessar categoria</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Products Catalog Index */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Índice de Produtos ({filteredProducts.length} itens)
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Links canônicos para páginas de produto
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onNavigate(`/produto/${p.slug}`)}
                  className="group text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-3"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-700 truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {p.weight} • {p.packaging}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      /produto/{p.slug}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Commercial & Customer Service Directives */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Atendimento Comercial & Informações de Vendas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {commercialInfo.map((info, idx) => (
              <div
                key={idx}
                onClick={info.action}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">Comercial</span>
                    {info.isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-slate-800">
                    {info.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Institutional, Factory & Legal */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Dados da Fábrica & Distribuição Oficial
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Fabricação tradicional em Porto Feliz - SP com distribuição nacional autorizada pela IR Distribuidora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Endereço da Fábrica</strong>
                <span>
                  {settings.street}, {settings.number} - {settings.neighborhood}
                  <br />
                  {settings.city} - {settings.state} • CEP {settings.zip_code}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Contatos Oficiais</strong>
                <span>Comercial WhatsApp: {settings.whatsapp || '(15) 99157-6707'}</span>
                {settings.phone ? (
                  <>
                    <br />
                    <span>Telefone: {settings.phone}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Registro & Distribuição</strong>
                <span>CNPJ: 18.492.301/0001-44</span>
                <br />
                <span className="text-slate-500">Distribuição Oficial: <strong>IR Distribuidora</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Área Restrita (Painel Administrativo) */}
        <section className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                <Lock className="w-3 h-3" />
                <span>Acesso Seguro</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Área Restrita (Painel Administrativo)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Área reservada exclusivamente para gestores da Neuza Doces e IR Distribuidora. É necessário autenticar com credenciais de administrador para acessar o painel de pedidos, produtos e configurações.
              </p>
            </div>

            <button
              id="sitemap-area-restrita-btn"
              onClick={() => onNavigate('/admin/login')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d6bd2d] hover:bg-[#c4ab25] text-[#091129] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Acessar Área Restrita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Section 7: Footer Copyright & Sitemap Status */}
        <section className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="text-center sm:text-left">
            <span>Neuza Doces © {new Date().getFullYear()} • Mapa do site atualizado com indexação ativa.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/admin/login')}
              className="group inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-[11px] px-2.5 py-1 rounded-md hover:bg-slate-100"
              title="Acesso à Área Restrita"
            >
              <Lock className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
              <span>Área Restrita</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
