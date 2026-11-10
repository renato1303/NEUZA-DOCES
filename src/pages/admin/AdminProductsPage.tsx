import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Package,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ClipboardList,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StockBadge } from '../../components/common/Badge';

interface AdminProductsPageProps {
  onNavigate: (path: string) => void;
}

const AVAILABLE_PRODUCT_IMAGES = [
  { label: 'Paçoca Rolha 1.1KG', path: '/rolha.jpg' },
  { label: 'Pé de Moça', path: '/pe de moca.jpeg' },
  { label: 'MarshMallow', path: '/marsh.jpeg' },
  { label: 'A.B', path: '/A.B.jpeg' },
  { label: 'Paçokão', path: '/pacokao.jpeg' },
  { label: 'Geleia de Mocotó', path: '/geleia de mocoto.jpeg' },
  { label: 'Paçoca Caseira', path: '/pacoca caseira.jpeg' },
  { label: 'Crocante', path: '/crocante.jpeg' },
  { label: 'Bombocado', path: '/bombocado.jpeg' },
  { label: 'Geleia de Frutas', path: '/1.jpeg' },
  { label: 'Cocada Tradicional', path: '/2.jpeg' },
  { label: 'Doce de Leite', path: '/3.jpeg' },
  { label: 'Torrone Amendoim', path: '/4.jpeg' },
  { label: 'Maria Mole', path: '/5.jpeg' },
  { label: 'Quebra Queixo', path: '/6.jpeg' },
  { label: 'Leite Pingado', path: '/7.jpeg' },
  { label: 'BomBom de Coco', path: '/8.jpeg' },
  { label: 'Geleia de Banana', path: '/9.jpeg' },
  { label: 'Paçoca Chocolate', path: '/10.jpeg' },
  { label: 'Cocada Pingada', path: '/11.jpeg' },
];

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ onNavigate: _onNavigate }) => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    updateProductStock,
    zeroAllProductStocks,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formLine, setFormLine] = useState<'Doces Tradicionais'>('Doces Tradicionais');
  const [formWeight, setFormWeight] = useState('1.1KG');
  const [formPackaging, setFormPackaging] = useState('CX 1X6');
  const [formPackageQtyInfo, setFormPackageQtyInfo] = useState('20 unidades');
  const [formPriceUnit, setFormPriceUnit] = useState('16.90');
  const [formPriceBox, setFormPriceBox] = useState('90.60');
  const [formUnitsPerBox, setFormUnitsPerBox] = useState('6');
  const [formStock, setFormStock] = useState('0');
  const [formMinStock, setFormMinStock] = useState('10');
  const [formImageUrl, setFormImageUrl] = useState('/rolha.jpg');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [imageSourceTab, setImageSourceTab] = useState<'gallery' | 'upload' | 'url'>('gallery');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterCategory !== 'all' && p.category_id !== filterCategory) {
        return false;
      }
      if (filterStock === 'low' && (p.stock > p.minimum_stock || p.stock <= 0)) {
        return false;
      }
      if (filterStock === 'out' && p.stock > 0) {
        return false;
      }
      return true;
    });
  }, [products, search, filterCategory, filterStock]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormCategoryId(categories[0]?.id || 'cat-1');
    setFormLine('Doces Tradicionais');
    setFormWeight('1.1KG');
    setFormPackaging('CX 1X6');
    setFormPackageQtyInfo('20 unidades');
    setFormPriceUnit('16.90');
    setFormPriceBox('90.60');
    setFormUnitsPerBox('6');
    setFormStock('0');
    setFormMinStock('10');
    setFormImageUrl('/rolha.jpg');
    setFormDescription(
      'Doce artesanal preparado segundo a autêntica receita da Neuza Doces, com ingredientes selecionados e ponto perfeito.'
    );
    setFormActive(true);
    setFormFeatured(false);
    setImageSourceTab('gallery');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormCategoryId(product.category_id);
    setFormLine(product.line);
    setFormWeight(product.weight);
    setFormPackaging(product.packaging);
    setFormPackageQtyInfo(product.package_qty_info || '20 unidades');
    setFormPriceUnit(String(product.price_unit));
    setFormPriceBox(String(product.price_box));
    setFormUnitsPerBox(String(product.units_per_box));
    setFormStock(String(product.stock));
    setFormMinStock(String(product.minimum_stock));
    setFormImageUrl(product.image_url);
    setFormDescription(product.description);
    setFormActive(product.active);
    setFormFeatured(product.featured);
    setImageSourceTab(
      AVAILABLE_PRODUCT_IMAGES.some((img) => img.path === product.image_url) ? 'gallery' : 'url'
    );
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
        showToast('Foto carregada com sucesso do seu aparelho!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDuplicate = (product: Product) => {
    addProduct({
      name: `${product.name} (Cópia)`,
      slug: `${product.slug}-copia-${Date.now().toString().slice(-4)}`,
      category_id: product.category_id,
      line: product.line,
      weight: product.weight,
      packaging: product.packaging,
      package_qty_info: product.package_qty_info,
      price_unit: product.price_unit,
      price_box: product.price_box,
      units_per_box: product.units_per_box,
      stock: product.stock,
      minimum_stock: product.minimum_stock,
      image_url: product.image_url,
      gallery: [product.image_url],
      description: product.description,
      short_description: product.short_description,
      active: true,
      featured: false,
      sale_type_allowed: 'both',
    });
    showToast(`Produto "${product.name}" duplicado com sucesso!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o doce "${name}" do catálogo?`)) {
      deleteProduct(id);
      showToast(`Produto "${name}" excluído.`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      alert('Informe o nome do doce.');
      return;
    }

    const productData = {
      name: formName.trim(),
      slug:
        formSlug.trim() ||
        formName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      category_id: formCategoryId,
      line: formLine,
      weight: formWeight.trim(),
      packaging: formPackaging.trim(),
      package_qty_info: formPackageQtyInfo.trim(),
      price_unit: parseFloat(formPriceUnit) || 0,
      price_box: parseFloat(formPriceBox) || 0,
      units_per_box: parseInt(formUnitsPerBox, 10) || 6,
      stock: parseInt(formStock, 10) || 0,
      minimum_stock: parseInt(formMinStock, 10) || 5,
      image_url: formImageUrl.trim() || '/rolha.jpg',
      gallery: [formImageUrl.trim() || '/rolha.jpg'],
      description: formDescription.trim(),
      short_description:
        formDescription.trim().slice(0, 90) + (formDescription.length > 90 ? '...' : ''),
      active: formActive,
      featured: formFeatured,
      sale_type_allowed: 'both' as const,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast(`Doce "${productData.name}" atualizado com sucesso!`);
    } else {
      addProduct(productData);
      showToast(`Novo doce "${productData.name}" adicionado com sucesso ao catálogo!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#101e4a] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-400/40 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Catálogo de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadastre novos doces, altere preços por pote (varejo), caixas (atacado), fotos e estoques.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Deseja zerar o estoque de todos os produtos para realizar o inventário físico da fábrica? Todos os produtos ficarão com 0 potes.'
                )
              ) {
                zeroAllProductStocks();
                showToast('Estoques zerados para inventário geral.');
              }
            }}
            className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs shadow-2xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            title="Zerar todos os estoques para contagem de inventário"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Zerar Estoques (Inventário)</span>
          </button>

          <button
            id="btn-add-product"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold text-xs shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Novo Doce</span>
          </button>
        </div>
      </div>

      {/* Inventory Banner if all stocks are 0 */}
      {products.length > 0 && products.every((p) => p.stock === 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 shadow-2xs">
          <ClipboardList className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-sm block">Inventário Geral Ativo (Estoques Zerados)</span>
            <p className="text-amber-800 leading-relaxed">
              Todos os doces estão com estoque em 0 potes para a realização do inventário físico da fábrica. Ajuste as quantidades diretamente na aba <strong>Estoque</strong> ou edite cada doce aqui conforme as contagens forem apuradas.
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome do doce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        {/* Category filter */}
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
          >
            <option value="all">Todas as Categorias ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({products.filter((p) => p.category_id === c.id).length})
              </option>
            ))}
          </select>
        </div>

        {/* Stock filter */}
        <div>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
          >
            <option value="all">Todos os status de estoque</option>
            <option value="low">Estoque Baixo (&lt; mínimo)</option>
            <option value="out">Esgotado (0 potes)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                <th className="py-3 px-4">Doce</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço Pote (Varejo)</th>
                <th className="py-3 px-4">Preço Caixa (Atacado)</th>
                <th className="py-3 px-4">Embalagem</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Nenhum doce encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Imagem + Nome */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {p.name}
                            {p.featured && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {p.weight} • {p.package_qty_info || '20 unidades'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3 px-4 text-slate-700">
                      {categories.find((c) => c.id === p.category_id)?.name || 'Sem Categoria'}
                    </td>

                    {/* Preço Unitário */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(p.price_unit)}
                    </td>

                    {/* Preço Caixa */}
                    <td className="py-3 px-4 font-bold text-blue-950">
                      {formatCurrency(p.price_box)}
                    </td>

                    {/* Embalagem */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{p.packaging}</span>
                      <span className="block text-[10px] text-slate-500">
                        {p.units_per_box} potes / caixa
                      </span>
                    </td>

                    {/* Estoque */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={p.stock}
                          min={0}
                          onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                        <StockBadge stock={p.stock} minStock={p.minimum_stock} />
                      </div>
                    </td>

                    {/* Status Ativo */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          p.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {p.active ? 'Ativo' : 'Oculto'}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Duplicar Doce"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          title="Editar Doce"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir Doce"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {editingProduct ? 'Editar Doce' : 'Cadastrar Novo Doce'}
                </h2>
                <span className="text-xs text-slate-500">
                  Preencha os dados e escolha a foto do produto. Todas as alterações são salvas imediatamente.
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
              {/* SEÇÃO 1: FOTO DO PRODUTO */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-900" />
                    Foto do Produto
                  </label>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageSourceTab('gallery')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        imageSourceTab === 'gallery'
                          ? 'bg-[#101e4a] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Galeria de Fotos
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceTab('upload')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        imageSourceTab === 'upload'
                          ? 'bg-[#101e4a] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Enviar Arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceTab('url')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        imageSourceTab === 'url'
                          ? 'bg-[#101e4a] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Digitar Link
                    </button>
                  </div>
                </div>

                {/* Preview e Seleção */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  {/* Thumbnail Atual */}
                  <div className="sm:col-span-1 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-2xl bg-white border-2 border-blue-900/40 p-2 flex items-center justify-center shadow-xs overflow-hidden relative group">
                      {formImageUrl ? (
                        <img
                          src={formImageUrl}
                          alt="Prévia"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center">Sem foto</span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1">Prévia Atual</span>
                  </div>

                  {/* Conteúdo de acordo com a aba selecionada */}
                  <div className="sm:col-span-3">
                    {imageSourceTab === 'gallery' && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-slate-600 block">
                          Clique na foto correspondente ao doce:
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                          {AVAILABLE_PRODUCT_IMAGES.map((img) => {
                            const isSelected = formImageUrl === img.path;
                            return (
                              <button
                                key={img.path}
                                type="button"
                                onClick={() => setFormImageUrl(img.path)}
                                className={`relative p-1 rounded-xl border-2 transition-all flex flex-col items-center cursor-pointer ${
                                  isSelected
                                    ? 'border-blue-900 bg-blue-50 ring-2 ring-blue-900/20'
                                    : 'border-slate-100 hover:border-slate-300 bg-white'
                                }`}
                                title={img.label}
                              >
                                <img
                                  src={img.path}
                                  alt={img.label}
                                  className="w-10 h-10 object-contain"
                                />
                                <span className="text-[9px] truncate w-full text-center mt-0.5 text-slate-700">
                                  {img.label}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-0.5 right-0.5 bg-blue-900 text-white rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {imageSourceTab === 'upload' && (
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-4 border-2 border-dashed border-blue-400/80 bg-blue-50/50 hover:bg-blue-50 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Upload className="w-5 h-5 text-blue-900" />
                          <span className="font-bold text-xs text-blue-950">
                            Selecionar foto do computador ou celular
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Formatos aceitos: JPG, PNG, WEBP
                          </span>
                        </button>
                      </div>
                    )}

                    {imageSourceTab === 'url' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Caminho ou Link Direto da Foto
                        </label>
                        <input
                          type="text"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          placeholder="Ex: /rolha.jpg ou https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: DADOS PRINCIPAIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Pé de Moça Artesanal"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Peso Individual */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peso Individual *</label>
                  <input
                    type="text"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="Ex: 1.1KG, 600G ou 800GR"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Quantidade de Unidades no Pote (PRESETS RÁPIDOS) */}
                <div className="sm:col-span-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-amber-950 text-xs">
                      Quantidade de Unidades no Pote *
                    </label>
                    <span className="text-[10px] text-amber-800">
                      Aparecerá quando selecionado &ldquo;Preço por pote varejo&rdquo;
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormPackageQtyInfo('20 unidades')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        formPackageQtyInfo === '20 unidades'
                          ? 'bg-[#101e4a] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Pote com 20 unidades (Padrão)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormPackageQtyInfo('18 unidades')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        formPackageQtyInfo === '18 unidades'
                          ? 'bg-[#101e4a] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Pote com 18 unidades (Bombocado)
                    </button>
                    <div className="flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={formPackageQtyInfo}
                        onChange={(e) => setFormPackageQtyInfo(e.target.value)}
                        placeholder="Outro texto (ex: 24 unidades)"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Preço por Pote (Varejo) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preço por Pote Varejo (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPriceUnit}
                    onChange={(e) => setFormPriceUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Preço por Caixa (Atacado) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preço por Caixa Atacado (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPriceBox}
                    onChange={(e) => setFormPriceBox(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Embalagem Atacado */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Descrição da Caixa (Atacado)
                  </label>
                  <input
                    type="text"
                    required
                    value={formPackaging}
                    onChange={(e) => setFormPackaging(e.target.value)}
                    placeholder="Ex: CX 1X6"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Potes por Caixa */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Potes por Caixa (Padrão: 6)
                  </label>
                  <input
                    type="number"
                    required
                    value={formUnitsPerBox}
                    onChange={(e) => setFormUnitsPerBox(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Estoque atual */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estoque Atual (Potes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Estoque mínimo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estoque Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Descrição do Produto
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Conte sobre os ingredientes, tradição e sabor..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">Ativo na Loja</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Destacar na Página Inicial
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Doce'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
