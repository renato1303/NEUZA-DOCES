import React, { useState, useMemo } from 'react';
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
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StockBadge } from '../../components/common/Badge';

interface AdminProductsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ onNavigate }) => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    updateProductStock,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formLine, setFormLine] = useState<'Doces Tradicionais'>('Doces Tradicionais');
  const [formWeight, setFormWeight] = useState('1.1KG');
  const [formPackaging, setFormPackaging] = useState('CX 1X6');
  const [formPackageQtyInfo, setFormPackageQtyInfo] = useState('6 potes');
  const [formPriceUnit, setFormPriceUnit] = useState('22.90');
  const [formPriceBox, setFormPriceBox] = useState('129.00');
  const [formUnitsPerBox, setFormUnitsPerBox] = useState('6');
  const [formStock, setFormStock] = useState('50');
  const [formMinStock, setFormMinStock] = useState('10');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

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
    setFormCategoryId(categories[0]?.id || '');
    setFormLine('Doces Tradicionais');
    setFormWeight('1.1KG');
    setFormPackaging('CX 1X6');
    setFormPackageQtyInfo('6 potes');
    setFormPriceUnit('22.90');
    setFormPriceBox('129.00');
    setFormUnitsPerBox('6');
    setFormStock('40');
    setFormMinStock('10');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80'
    );
    setFormDescription(
      'Doce artesanal preparado segundo a autêntica receita da Neuza Doces, com cozimento lento e ingredientes selecionados.'
    );
    setFormActive(true);
    setFormFeatured(false);
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
    setFormPackageQtyInfo(product.package_qty_info || '6 potes');
    setFormPriceUnit(String(product.price_unit));
    setFormPriceBox(String(product.price_box));
    setFormUnitsPerBox(String(product.units_per_box));
    setFormStock(String(product.stock));
    setFormMinStock(String(product.minimum_stock));
    setFormImageUrl(product.image_url);
    setFormDescription(product.description);
    setFormActive(product.active);
    setFormFeatured(product.featured);
    setIsModalOpen(true);
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
      description: product.description,
      short_description: product.short_description,
      active: true,
      featured: false,
      sale_type_allowed: product.sale_type_allowed,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o doce "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formName.trim(),
      slug:
        formSlug.trim() ||
        formName
          .toLowerCase()
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
      image_url: formImageUrl.trim(),
      description: formDescription.trim(),
      short_description: formDescription.slice(0, 90) + '...',
      active: formActive,
      featured: formFeatured,
      sale_type_allowed: 'ambos' as const,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Catálogo de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gerencie preços por pote, caixas de atacado (CX 1X6), estoque e status na loja.
          </p>
        </div>

        <button
          id="btn-add-product"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold text-xs shadow-xs flex items-center gap-2 self-start sm:self-auto active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Doce</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome..."
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
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white text-slate-700"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white text-slate-700"
          >
            <option value="all">Todos os Níveis de Estoque</option>
            <option value="low">Apenas Estoque Baixo</option>
            <option value="out">Apenas Esgotados</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Produto</th>
                <th className="py-3 px-4 font-bold">Embalagem</th>
                <th className="py-3 px-4 font-bold">Preço Pote</th>
                <th className="py-3 px-4 font-bold">Preço Caixa</th>
                <th className="py-3 px-4 font-bold">Estoque</th>
                <th className="py-3 px-4 font-bold">Loja</th>
                <th className="py-3 px-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                            {p.featured && (
                              <span className="p-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200" title="Destaque">
                                <Sparkles className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span>{cat?.name || 'Geral'}</span>
                            <span>•</span>
                            <span className="font-semibold text-blue-900">{p.weight}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Packaging */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800 block">{p.packaging}</span>
                      <span className="text-[11px] text-slate-400">
                        {p.units_per_box} potes / caixa
                      </span>
                    </td>

                    {/* Price Unit */}
                    <td className="py-3 px-4 font-serif font-bold text-slate-900">
                      {formatCurrency(p.price_unit)}
                    </td>

                    {/* Price Box */}
                    <td className="py-3 px-4 font-serif font-bold text-blue-950">
                      {formatCurrency(p.price_box)}
                    </td>

                    {/* Stock with quick inline adjust */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <StockBadge stock={p.stock} minStock={p.minimum_stock} />
                        <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="px-1.5 py-0.5 hover:bg-white text-slate-600 font-bold"
                            title="Diminuir 1 pote"
                          >
                            -
                          </button>
                          <span className="px-1 font-mono text-[11px] font-bold text-slate-800">
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, p.stock + 1)}
                            className="px-1.5 py-0.5 hover:bg-white text-slate-600 font-bold"
                            title="Aumentar 1 pote"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Active toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleProductActive(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          p.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {p.active ? 'Ativo' : 'Pausado'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/produto/${p.slug}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-900 hover:bg-blue-50"
                          title="Ver na Loja"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-900 hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="font-serif text-xl font-bold text-slate-900">
                {editingProduct ? 'Editar Doce' : 'Cadastrar Novo Doce'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
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
                    placeholder="Ex: Pé de Moça Tradicional"
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

                {/* Linha */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Linha *</label>
                  <select
                    value={formLine}
                    onChange={(e) => setFormLine(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    <option value="Doces Tradicionais">Doces Tradicionais</option>
                  </select>
                </div>

                {/* Peso */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peso Individual *</label>
                  <input
                    type="text"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="Ex: 1.1KG ou 400g"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Embalagem */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Embalagem Atacado *</label>
                  <input
                    type="text"
                    required
                    value={formPackaging}
                    onChange={(e) => setFormPackaging(e.target.value)}
                    placeholder="Ex: CX 1X6"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Preço Unitário */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preço por Pote (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPriceUnit}
                    onChange={(e) => setFormPriceUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Preço da Caixa */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preço da Caixa (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPriceBox}
                    onChange={(e) => setFormPriceBox(e.target.value)}
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
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

                {/* Imagem URL */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Descrição Detalhada</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
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

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold shadow-xs active:scale-95"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Doce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
