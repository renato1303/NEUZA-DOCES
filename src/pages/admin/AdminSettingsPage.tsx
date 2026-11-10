import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Store,
  ShieldCheck,
  Truck,
  QrCode,
  Megaphone,
  Sparkles,
  Phone,
  MapPin,
  Share2,
  Users,
  UserPlus,
  Trash2,
  Key,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, currentUser } = useStore();

  // Tab state for easy navigation
  const [activeTab, setActiveTab] = useState<'geral' | 'banner' | 'contato' | 'fiscal' | 'usuarios'>('geral');

  // Usuários Administradores
  const [adminList, setAdminList] = useState<any[]>([]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Identidade & Geral
  const [storeName, setStoreName] = useState(settings.store_name || 'Neuza Doces');
  const [distributionText, setDistributionText] = useState(
    settings.distribution_text || 'DISTRIBUÍDO POR IR DISTRIBUIDORA'
  );
  const [logo, setLogo] = useState(settings.logo || '/logo.png');
  const [cnpj, setCnpj] = useState(settings.cnpj || '18.492.301/0001-44');
  const [aboutText, setAboutText] = useState(
    settings.about_text ||
      'Doces artesanais produzidos com carinho e tradição brasileira. Sabores que resgatam memórias afetivas e transformam qualquer momento em celebração.'
  );

  // Banner & Anúncios
  const [announcementBarEnabled, setAnnouncementBarEnabled] = useState(
    settings.announcement_bar_enabled !== false
  );
  const [announcementBarText, setAnnouncementBarText] = useState(
    settings.announcement_bar_text ||
      '🍬 Vendas no Atacado (caixas) e Varejo (potes). Entregamos para todo o Brasil!'
  );
  const [heroBadge, setHeroBadge] = useState(
    settings.hero_badge || 'TRADIÇÃO ARTESANAL BRASILEIRA'
  );
  const [heroTitle, setHeroTitle] = useState(
    settings.hero_title || 'Doces artesanais tradicionais com o sabor inconfundível da Neuza Doces.'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    settings.hero_subtitle ||
      'Receitas feitas em tachos com ingredientes selecionados. Potes avulsos e caixas fechadas no atacado para todo o Brasil.'
  );
  const [heroCtaText, setHeroCtaText] = useState(
    settings.hero_cta_text || 'Ver Catálogo Completo'
  );

  // Contato & Redes Sociais
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '(15) 99157-6707');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || 'contato@neuzadoces.com.br');
  const [workingHours, setWorkingHours] = useState(
    settings.working_hours || 'Seg a Sex: 07h às 17h • Sáb: 08h às 12h'
  );
  const [instagram, setInstagram] = useState(settings.instagram || '@docesneuzaa');
  const [facebook, setFacebook] = useState(settings.facebook || 'neuzadocesartesanais');
  const [tiktok, setTiktok] = useState(settings.tiktok || '@neuzadoces');

  // Endereço
  const [zipCode, setZipCode] = useState(settings.zip_code || '18117-222');
  const [street, setStreet] = useState(settings.street || 'Rua Pastor Carlos de Assumpção Mena');
  const [number, setNumber] = useState(settings.number || '102');
  const [neighborhood, setNeighborhood] = useState(settings.neighborhood || 'Parque Jataí');
  const [city, setCity] = useState(settings.city || 'Votorantim');
  const [state, setState] = useState(settings.state || 'SP');

  // Comercial, Pix & Fiscal
  const [pixKey, setPixKey] = useState(settings.pix_key || 'renatoinacio2@gmail.com');
  const [invoiceFeePercentage, setInvoiceFeePercentage] = useState(
    String(settings.invoice_fee_percentage || 7)
  );
  const [flatShippingFee, setFlatShippingFee] = useState(String(settings.flat_shipping_fee || 0));
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    String(settings.free_shipping_threshold || 0)
  );
  const [minimumOrderValue, setMinimumOrderValue] = useState(
    String(settings.minimum_order_value || 50)
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        const hasMaster = data.some(
          (a: any) => a.email === 'master@neuzadoces.com.br' || a.name === 'Master'
        );
        const list = hasMaster
          ? data
          : [
              {
                id: 'master-primary',
                name: 'Master',
                email: 'Usuário: Master (Senha: Neuza2026$)',
                role: 'admin',
                active: true,
              },
              ...data,
            ];
        setAdminList(list);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMsg('');
    setAdminSuccessMsg('');
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      setAdminErrorMsg('Preencha nome, e-mail e senha.');
      return;
    }
    setIsSubmittingAdmin(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim().toLowerCase(),
          password: newAdminPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao criar usuário.');
      }
      setAdminSuccessMsg(`Usuário ${newAdminName} criado com sucesso!`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      loadAdmins();
    } catch (err: any) {
      setAdminErrorMsg(err.message || 'Falha ao cadastrar.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id: number, emailToDelete: string) => {
    if (confirm(`Remover acesso administrativo de "${emailToDelete}"?`)) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
          loadAdmins();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      store_name: storeName.trim(),
      distribution_text: distributionText.trim(),
      logo: logo.trim(),
      cnpj: cnpj.trim(),
      about_text: aboutText.trim(),

      announcement_bar_enabled: announcementBarEnabled,
      announcement_bar_text: announcementBarText.trim(),
      hero_badge: heroBadge.trim(),
      hero_title: heroTitle.trim(),
      hero_subtitle: heroSubtitle.trim(),
      hero_cta_text: heroCtaText.trim(),

      whatsapp: whatsapp.trim(),
      phone: phone.trim(),
      email: email.trim(),
      working_hours: workingHours.trim(),
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      tiktok: tiktok.trim(),

      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      zip_code: zipCode.trim(),
      address: `${street.trim()}, ${number.trim()} - ${neighborhood.trim()}, ${city.trim()} - ${state.trim()}, ${zipCode.trim()}`,

      pix_key: pixKey.trim(),
      invoice_fee_percentage: parseFloat(invoiceFeePercentage) || 7,
      flat_shipping_fee: parseFloat(flatShippingFee) || 0,
      free_shipping_threshold: parseFloat(freeShippingThreshold) || 0,
      minimum_order_value: parseFloat(minimumOrderValue) || 50,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (
      confirm(
        'Tem certeza que deseja restaurar as configurações originais da loja? Quaisquer alterações recentes serão substituídas pelos valores padrões de fábrica.'
      )
    ) {
      resetDemoData();
      alert('Configurações restauradas com sucesso!');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Personalização & Configurações do Site
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Liberdade total para alterar títulos, textos de distribuição, avisos, banner, regras fiscais e contatos.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Alterações salvas no banco de dados e aplicadas no site!</span>
          </div>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('geral')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'geral'
              ? 'border-[#101e4a] text-[#101e4a] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>1. Identidade & Marca</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'banner'
              ? 'border-[#101e4a] text-[#101e4a] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>2. Banner Principal & Avisos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contato')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'contato'
              ? 'border-[#101e4a] text-[#101e4a] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>3. Contatos & Endereço</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fiscal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'fiscal'
              ? 'border-[#101e4a] text-[#101e4a] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-600" />
          <span>4. Chave Pix & Regras Fiscais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'usuarios'
              ? 'border-[#101e4a] text-[#101e4a] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-blue-900" />
          <span>5. Usuários Administradores</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* ======================================================== */}
        {/* TAB 1: IDENTIDADE & TEXTOS DE MARCA */}
        {/* ======================================================== */}
        {activeTab === 'geral' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Store className="w-5 h-5 text-blue-900" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Identidade da Loja & Textos Oficiais
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Defina o nome da loja, a frase de distribuição exibida abaixo da logo e os dados cadastrais.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome Fantasia */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nome da Loja / Fábrica *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Exibido no cabeçalho, rodapé e nos comprovantes.
                  </span>
                </div>

                {/* Texto de Distribuição Oficial */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Texto de Distribuição Oficial *
                  </label>
                  <input
                    type="text"
                    required
                    value={distributionText}
                    onChange={(e) => setDistributionText(e.target.value)}
                    placeholder="Ex: DISTRIBUÍDO POR IR DISTRIBUIDORA"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/30 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-amber-800 mt-1 block">
                    Aparece destacado abaixo da logo em todo o site.
                  </span>
                </div>

                {/* Logotipo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Caminho ou URL do Logotipo
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="/logo.png"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Padrão: <code>/logo.png</code>
                  </span>
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNPJ da Empresa</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>

                {/* Sobre a Empresa / História */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Texto Institucional / Sobre a Empresa (Rodapé)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BANNER PRINCIPAL & BARRA DE ANÚNCIOS */}
        {/* ======================================================== */}
        {activeTab === 'banner' && (
          <div className="space-y-5">
            {/* Barra de Anúncios no Topo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <div>
                    <h2 className="font-serif text-base font-bold text-slate-900">
                      Barra de Anúncios no Topo do Site
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      Faixa amarela no topo de todas as páginas da loja para avisos promocionais.
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={announcementBarEnabled}
                    onChange={(e) => setAnnouncementBarEnabled(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-bold text-slate-800 text-xs">Exibir Barra</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Texto da Mensagem no Topo
                </label>
                <input
                  type="text"
                  value={announcementBarText}
                  onChange={(e) => setAnnouncementBarText(e.target.value)}
                  placeholder="Ex: 🍬 Vendas no Atacado (caixas) e Varejo (potes). Entregamos para todo o Brasil!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
                />
              </div>

              {/* Prévia da barra */}
              {announcementBarEnabled && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Prévia da Barra:
                  </span>
                  <div className="bg-[#d6bd2d] text-[#091129] py-1.5 px-3 rounded-lg text-center text-xs font-bold shadow-2xs">
                    {announcementBarText || 'Digite uma mensagem...'}
                  </div>
                </div>
              )}
            </div>

            {/* Banner Principal (Hero Section) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-blue-900" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Banner Principal da Página Inicial (Hero)
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Altere o selo de destaque, o título gigante, o parágrafo explicativo e o botão de ação.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Selo / Badge */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selo / Tagline Superior
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    placeholder="Ex: TRADIÇÃO ARTESANAL BRASILEIRA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden uppercase tracking-wider font-bold"
                  />
                </div>

                {/* Botão de Ação */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Texto do Botão de Ação (CTA)
                  </label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    placeholder="Ex: Ver Catálogo Completo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                  />
                </div>

                {/* Título Principal */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Título Principal do Banner *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden font-serif"
                  />
                </div>

                {/* Subtítulo / Descrição */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Subtítulo / Descrição do Banner
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>
              </div>

              {/* Prévia do Hero Banner */}
              <div className="p-5 bg-[#091129] text-white rounded-2xl text-center space-y-3 mt-4 border border-blue-950">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                  Prévia do Banner
                </span>
                {heroBadge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-950 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-blue-900">
                    {heroBadge}
                  </span>
                )}
                <h3 className="font-serif text-lg sm:text-xl font-bold max-w-xl mx-auto leading-tight">
                  {heroTitle}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  {heroSubtitle}
                </p>
                {heroCtaText && (
                  <div className="pt-1">
                    <span className="inline-block px-4 py-2 bg-[#d6bd2d] text-[#091129] font-bold text-xs rounded-xl shadow-xs">
                      {heroCtaText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONTATOS & ENDEREÇO DA FÁBRICA */}
        {/* ======================================================== */}
        {activeTab === 'contato' && (
          <div className="space-y-5">
            {/* Contatos & Redes */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Atendimento, WhatsApp & Redes Sociais
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    O WhatsApp configurado aqui é usado nos botões de atendimento direto do cliente.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Comercial de Vendas *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: (15) 99157-6707"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/30 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Utilizado no link de suporte direto do topo do site.
                  </span>
                </div>

                {/* Telefone Fixo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Telefone Fixo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (15) 3243-0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* E-mail Comercial */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    E-mail Comercial de Vendas
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Horário de Atendimento */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Horário de Atendimento da Fábrica
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="Ex: Seg a Sex: 07h às 17h • Sáb: 08h às 12h"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@docesneuzaa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Facebook</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="neuzadocesartesanais"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* TikTok */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">TikTok</label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@neuzadoces"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Endereço Físico */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-blue-900" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Endereço da Fábrica & Distribuidora
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Endereço exibido no rodapé da loja e nos documentos de pedido.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Logradouro / Rua</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade / Estado</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <input
                      type="text"
                      value={state}
                      maxLength={2}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="UF"
                      className="w-14 px-2 py-2 rounded-xl border border-slate-300 text-xs text-center uppercase font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PIX & REGRAS FISCAIS */}
        {/* ======================================================== */}
        {activeTab === 'fiscal' && (
          <div className="space-y-5">
            {/* Chave Pix */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Recebimento de Pedidos via Pix
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Chave Pix para onde o dinheiro dos pedidos é direcionado via QR Code oficial do Banco Central.
                  </span>
                </div>
              </div>

              <div className="max-w-md space-y-2">
                <label className="block font-bold text-slate-700">
                  Chave Pix (E-mail, CPF/CNPJ, Telefone ou Aleatória) *
                </label>
                <input
                  type="text"
                  required
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Ex: renatoinacio2@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                />
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    O sistema gera dinamicamente o QR Code EMV com o valor exato de cada pedido e a chave Pix configurada acima.
                  </span>
                </div>
              </div>
            </div>

            {/* Regra de Nota Fiscal */}
            <div className="bg-blue-50/60 p-6 rounded-2xl border-2 border-blue-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-blue-200/70">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                <div>
                  <h2 className="font-serif text-base font-bold text-blue-950">
                    Alíquota Comercial para Nota Fiscal (NF)
                  </h2>
                  <span className="text-[11px] text-blue-800">
                    Percentual adicionado automaticamente quando o cliente marca a opção de emissão de NF.
                  </span>
                </div>
              </div>

              <div className="max-w-xs space-y-1">
                <label className="block font-bold text-blue-950">
                  Acréscimo da Nota Fiscal (%)
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
                <span className="text-[11px] text-blue-800 block pt-1">
                  Padrão comercial configurado: <strong>7%</strong>.
                </span>
              </div>
            </div>

            {/* Parâmetros de Pedido Mínimo & Frete */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Truck className="w-5 h-5 text-blue-900" />
                <h2 className="font-serif text-base font-bold text-slate-900">
                  Parâmetros de Pedido Mínimo & Frete
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Valor Mínimo do Pedido (R$)
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={minimumOrderValue}
                    onChange={(e) => setMinimumOrderValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Frete Fixo Base (R$)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={flatShippingFee}
                    onChange={(e) => setFlatShippingFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (0 = frete sob consulta via WhatsApp)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mínimo para Frete Grátis (R$)
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: USUÁRIOS ADMINISTRADORES */}
        {/* ======================================================== */}
        {activeTab === 'usuarios' && (
          <div className="space-y-5">
            {/* Lista de Administradores */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-900" />
                  <div>
                    <h2 className="font-serif text-base font-bold text-slate-900">
                      Administradores Cadastrados no Banco de Dados
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      Usuários que possuem autorização para acessar o painel de controle e gerenciar a fábrica.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadAdmins}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Atualizar Lista</span>
                </button>
              </div>

              <div className="space-y-2">
                {adminList.map((admin) => {
                  const isCurrent = currentUser?.email?.toLowerCase() === admin.email?.toLowerCase();
                  return (
                    <div
                      key={admin.id || admin.email}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#101e4a] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                          {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {admin.name}
                            </span>
                            {isCurrent && (
                              <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                Você
                              </span>
                            )}
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Acesso Ativo
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono block mt-0.5">
                            {admin.email}
                          </span>
                        </div>
                      </div>

                      {admin.email !== 'renatoinacio2@gmail.com' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remover acesso deste administrador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cadastrar Novo Administrador */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900">
                    Cadastrar Novo Administrador
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Crie um novo acesso para outro gestor ou funcionário com permissão total.
                  </span>
                </div>
              </div>

              {adminSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}

              {adminErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{adminErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    E-mail do Administrador *
                  </label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Senha de Acesso *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Mínimo 4 dígitos"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      disabled={isSubmittingAdmin}
                      onClick={handleCreateAdmin}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isSubmittingAdmin ? 'Criando...' : '+ Cadastrar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões de Fábrica</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações do Site</span>
          </button>
        </div>
      </form>
    </div>
  );
};
