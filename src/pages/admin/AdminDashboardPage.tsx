import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  ShieldCheck,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { DashboardPeriod, Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { orders, products, categories } = useStore();
  const [period, setPeriod] = useState<DashboardPeriod>('todos');
  const [rankingMode, setRankingMode] = useState<'quantity' | 'revenue'>('revenue');

  // Filter orders based on period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (period === 'hoje') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (period === 'ontem') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      }
      if (period === '7dias') {
        const d7 = new Date(now);
        d7.setDate(now.getDate() - 7);
        return orderDate >= d7;
      }
      if (period === '30dias') {
        const d30 = new Date(now);
        d30.setDate(now.getDate() - 30);
        return orderDate >= d30;
      }
      if (period === 'mes_atual') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === 'ano_atual') {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true; // 'todos'
    });
  }, [orders, period]);

  // Non-cancelled orders for metrics
  const validOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status !== 'cancelado');
  }, [filteredOrders]);

  // Key Indicators
  const grossRevenue = useMemo(() => {
    return validOrders.reduce((sum, o) => sum + o.total, 0);
  }, [validOrders]);

  const totalOrdersCount = validOrders.length;

  const averageTicket = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;

  const totalUnitsSold = useMemo(() => {
    return validOrders.reduce((sum, o) => {
      return (
        sum +
        o.items.reduce((itemSum, item) => {
          const mult = item.sale_type === 'caixa' ? 6 : 1;
          return itemSum + item.quantity * mult;
        }, 0)
      );
    }, 0);
  }, [validOrders]);

  const invoiceOrders = validOrders.filter((o) => o.has_invoice);
  const totalInvoiceFeeRevenue = invoiceOrders.reduce((sum, o) => sum + o.invoice_fee_amount, 0);

  // Sales Evolution Data for Chart
  const salesEvolutionData = useMemo(() => {
    const map: Record<string, { date: string; revenue: number; orders: number }> = {};

    // Sort ascending by date
    const sorted = [...validOrders].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sorted.forEach((order) => {
      const d = new Date(order.created_at);
      const key = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      if (!map[key]) {
        map[key] = { date: key, revenue: 0, orders: 0 };
      }
      map[key].revenue += order.total;
      map[key].orders += 1;
    });

    return Object.values(map);
  }, [validOrders]);

  // Category sales distribution
  const categorySalesData = useMemo(() => {
    const catMap: Record<string, number> = {};

    validOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.product_id);
        const catId = prod?.category_id || 'outros';
        const cat = categories.find((c) => c.id === catId);
        const name = cat?.name || 'Geral';
        catMap[name] = (catMap[name] || 0) + item.subtotal;
      });
    });

    const colors = ['#091129', '#1b2c6f', '#d6bd2d', '#357fc2', '#0d1738'];
    return Object.entries(catMap).map(([name, value], idx) => ({
      name,
      value: Math.round(value),
      color: colors[idx % colors.length],
    }));
  }, [validOrders, products, categories]);

  // Top products ranking
  const topProductsRanking = useMemo(() => {
    const map: Record<
      string,
      { id: string; name: string; quantity: number; revenue: number; image?: string }
    > = {};

    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.product_id]) {
          map[item.product_id] = {
            id: item.product_id,
            name: item.product_name,
            quantity: 0,
            revenue: 0,
            image: item.image_url,
          };
        }
        const unitsCount = item.sale_type === 'caixa' ? item.quantity * 6 : item.quantity;
        map[item.product_id].quantity += unitsCount;
        map[item.product_id].revenue += item.subtotal;
      });
    });

    return Object.values(map)
      .sort((a, b) =>
        rankingMode === 'revenue' ? b.revenue - a.revenue : b.quantity - a.quantity
      )
      .slice(0, 5);
  }, [validOrders, rankingMode]);

  return (
    <div className="space-y-8">
      {/* Page Title & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Painel de Controle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visão geral de desempenho financeiro, pedidos e vendas da Neuza Doces.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs shadow-2xs">
          {(
            [
              { id: 'hoje', label: 'Hoje' },
              { id: '7dias', label: '7 Dias' },
              { id: '30dias', label: '30 Dias' },
              { id: 'mes_atual', label: 'Este Mês' },
              { id: 'ano_atual', label: 'Este Ano' },
              { id: 'todos', label: 'Todo Período' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                period === t.id
                  ? 'bg-[#101e4a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Indicator Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Faturamento Bruto</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-slate-900">
            {formatCurrency(grossRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs anterior</span>
          </div>
        </div>

        {/* Metric 2: Quantidade de Pedidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total de Pedidos</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-slate-900">
            {totalOrdersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.1% no período</span>
          </div>
        </div>

        {/* Metric 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Ticket Médio</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-slate-900">
            {formatCurrency(averageTicket)}
          </div>
          <div className="text-[11px] text-slate-400">Por pedido emitido</div>
        </div>

        {/* Metric 4: Potes/Unidades Vendidas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Potes Vendidos</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-slate-900">
            {totalUnitsSold} potes
          </div>
          <div className="text-[11px] text-slate-400">Em caixas e avulsos</div>
        </div>

        {/* Metric 5: Pedidos com NF */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pedidos com NF</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-slate-900">
            {invoiceOrders.length}
          </div>
          <div className="text-[11px] text-blue-900 font-semibold">
            {totalOrdersCount > 0
              ? `${Math.round((invoiceOrders.length / totalOrdersCount) * 100)}% dos pedidos`
              : '0%'}
          </div>
        </div>

        {/* Metric 6: Acréscimo Fiscal de 7% */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Receita Taxa NF (+7%)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-xl font-bold text-blue-950">
            {formatCurrency(totalInvoiceFeeRevenue)}
          </div>
          <div className="text-[11px] text-slate-400">Acréscimo comercial 7%</div>
        </div>
      </div>

      {/* Interactive Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Evolution Line/Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900">
                Evolução das Vendas (R$)
              </h2>
              <p className="text-xs text-slate-400">
                Faturamento diário acumulado no período selecionado
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-950 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {formatCurrency(grossRevenue)} total
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {salesEvolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesEvolutionData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1b2c6f" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1b2c6f" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Faturamento']}
                    contentStyle={{
                      backgroundColor: '#091129',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1b2c6f"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Nenhum pedido no período selecionado
              </div>
            )}
          </div>
        </div>

        {/* Category Sales Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-slate-900">
              Vendas por Categoria
            </h2>
            <p className="text-xs text-slate-400">Distribuição financeira de receita</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {categorySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySalesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Total']}
                    contentStyle={{
                      backgroundColor: '#091129',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">Sem dados</span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            {categorySalesData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </span>
                <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-serif text-base font-bold text-slate-900">
              Produtos Mais Vendidos
            </h2>
            {/* Toggle switch between revenue and quantity */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setRankingMode('revenue')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  rankingMode === 'revenue'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Por R$
              </button>
              <button
                onClick={() => setRankingMode('quantity')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  rankingMode === 'quantity'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Por Potes
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {topProductsRanking.map((prod, idx) => (
              <div key={prod.id} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <div>
                    <span className="font-semibold text-slate-900 line-clamp-1">
                      {prod.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {prod.quantity} potes vendidos
                    </span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {formatCurrency(prod.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-serif text-base font-bold text-slate-900">
              Últimos Pedidos
            </h2>
            <button
              onClick={() => onNavigate('/admin/pedidos')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              Ver todos os pedidos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[10px]">
                  <th className="pb-2 font-semibold">Nº Pedido</th>
                  <th className="pb-2 font-semibold">Cliente</th>
                  <th className="pb-2 font-semibold">NF (7%)</th>
                  <th className="pb-2 font-semibold">Total</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onNavigate(`/admin/pedidos`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold font-mono text-slate-900">
                      {order.order_number}
                    </td>
                    <td className="py-2.5 font-medium text-slate-800">
                      {order.customer.name}
                    </td>
                    <td className="py-2.5">
                      {order.has_invoice ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                          Sim (+7%)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Não</span>
                      )}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 font-serif">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-2.5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
