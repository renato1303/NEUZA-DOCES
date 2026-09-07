import React, { useState, useMemo } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Package,
  ArrowUpDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StockBadge } from '../../components/common/Badge';

export const AdminStockPage: React.FC = () => {
  const { products, updateProductStock } = useStore();
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'normal' | 'low' | 'out'>('all');

  const stats = useMemo(() => {
    const totalPots = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minimum_stock).length;
    const outOfStockCount = products.filter((p) => p.stock <= 0).length;
    const totalBoxesPossible = products.reduce(
      (acc, p) => acc + Math.floor(p.stock / p.units_per_box),
      0
    );

    return { totalPots, lowStockCount, outOfStockCount, totalBoxesPossible };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (stockFilter === 'normal' && (p.stock <= p.minimum_stock || p.stock === 0)) {
        return false;
      }
      if (stockFilter === 'low' && (p.stock > p.minimum_stock || p.stock === 0)) {
        return false;
      }
      if (stockFilter === 'out' && p.stock > 0) {
        return false;
      }
      return true;
    });
  }, [products, search, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Controle de Estoque
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Acompanhamento de estoque em potes individuais e caixas fechadas (CX 1X6).
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Potes em Estoque</span>
            <Boxes className="w-4 h-4 text-blue-900" />
          </div>
          <div className="font-serif text-2xl font-bold text-slate-900">
            {stats.totalPots} potes
          </div>
          <div className="text-[11px] text-slate-400">Total somado de todos os doces</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Caixas Fechadas (1X6)</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-slate-900">
            {stats.totalBoxesPossible} caixas
          </div>
          <div className="text-[11px] text-slate-400">Capacidade de faturamento CX</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
            <span>Estoque Baixo</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-amber-900">
            {stats.lowStockCount} produtos
          </div>
          <div className="text-[11px] text-amber-700">Abaixo do mínimo estipulado</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold">
            <span>Produtos Esgotados</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-rose-900">
            {stats.outOfStockCount} produtos
          </div>
          <div className="text-[11px] text-rose-700">Requer reposição urgente</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar doce por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              stockFilter === 'all'
                ? 'bg-[#101e4a] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setStockFilter('normal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              stockFilter === 'normal'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              stockFilter === 'low'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Baixo ({stats.lowStockCount})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              stockFilter === 'out'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Esgotado ({stats.outOfStockCount})
          </button>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Produto</th>
                <th className="py-3 px-4 font-bold">Embalagem</th>
                <th className="py-3 px-4 font-bold">Estoque Atual</th>
                <th className="py-3 px-4 font-bold">Caixas Completas</th>
                <th className="py-3 px-4 font-bold">Estoque Mínimo</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Ajuste Rápido de Potes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const boxesPossible = Math.floor(product.stock / product.units_per_box);
                const leftovers = product.stock % product.units_per_box;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{product.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {product.line} • {product.weight}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-900 block">
                        {product.packaging}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {product.units_per_box} potes por caixa
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      {product.stock} potes
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-bold text-blue-950 block">
                        {boxesPossible} caixas
                      </span>
                      {leftovers > 0 && (
                        <span className="text-[11px] text-slate-400">
                          + {leftovers} potes avulsos
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {product.minimum_stock} potes
                    </td>

                    <td className="py-3 px-4">
                      <StockBadge stock={product.stock} minStock={product.minimum_stock} />
                    </td>

                    {/* Quick inline adjustment buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateProductStock(
                              product.id,
                              Math.max(0, product.stock - product.units_per_box)
                            )
                          }
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[11px]"
                          title="Subtrair 1 caixa (6 potes)"
                        >
                          -6
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateProductStock(product.id, Math.max(0, product.stock - 1))
                          }
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[11px]"
                          title="Subtrair 1 pote"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStock(product.id, product.stock + 1)}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 font-mono font-bold text-[11px] border border-blue-200"
                          title="Adicionar 1 pote"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateProductStock(product.id, product.stock + product.units_per_box)
                          }
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 font-mono font-bold text-[11px] border border-blue-200"
                          title="Adicionar 1 caixa (6 potes)"
                        >
                          +6
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
    </div>
  );
};
