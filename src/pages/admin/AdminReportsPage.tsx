import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const AdminReportsPage: React.FC = () => {
  const { orders, products, categories, settings } = useStore();
  const [reportType, setReportType] = useState<'sales' | 'invoices' | 'categories'>('sales');

  const validOrders = useMemo(() => orders.filter((o) => o.status !== 'cancelado'), [orders]);

  // Overall totals
  const totalRevenue = useMemo(
    () => validOrders.reduce((sum, o) => sum + o.total, 0),
    [validOrders]
  );
  const totalSubtotal = useMemo(
    () => validOrders.reduce((sum, o) => sum + o.subtotal, 0),
    [validOrders]
  );
  const totalInvoiceFees = useMemo(
    () => validOrders.reduce((sum, o) => sum + o.invoice_fee_amount, 0),
    [validOrders]
  );
  const totalShipping = useMemo(
    () => validOrders.reduce((sum, o) => sum + o.shipping, 0),
    [validOrders]
  );

  // Category performance
  const categoryStats = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; quantity: number }> = {};

    validOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.product_id);
        const cat = categories.find((c) => c.id === prod?.category_id);
        const catName = cat?.name || 'Geral';

        if (!map[catName]) {
          map[catName] = { name: catName, revenue: 0, quantity: 0 };
        }
        const mult = item.sale_type === 'caixa' ? 6 : 1;
        map[catName].quantity += item.quantity * mult;
        map[catName].revenue += item.subtotal;
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [validOrders, products, categories]);

  // Invoice Breakdown
  const invoiceOrders = validOrders.filter((o) => o.has_invoice);
  const nonInvoiceOrders = validOrders.filter((o) => !o.has_invoice);

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'sales') {
      csvContent += 'Numero Pedido,Data,Cliente,Documento,Pagamento,Subtotal,Taxa NF,Frete,Total,Status\n';
      validOrders.forEach((o) => {
        csvContent += `"${o.order_number}","${o.created_at}","${o.customer.name}","${
          o.customer.document || ''
        }","${o.payment_method}",${o.subtotal},${o.invoice_fee_amount},${o.shipping},${o.total},"${o.status}"\n`;
      });
    } else if (reportType === 'invoices') {
      csvContent += 'Numero Pedido,Cliente,Documento,Com NF,Valor Subtotal,Taxa NF 7%,Total Pedido\n';
      validOrders.forEach((o) => {
        csvContent += `"${o.order_number}","${o.customer.name}","${
          o.customer.document || ''
        }","${o.has_invoice ? 'SIM' : 'NAO'}",${o.subtotal},${o.invoice_fee_amount},${o.total}\n`;
      });
    } else {
      csvContent += 'Categoria,Potes Vendidos,Faturamento Total\n';
      categoryStats.forEach((c) => {
        csvContent += `"${c.name}",${c.quantity},${c.revenue}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-neuza-doces-${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Relatórios e Demonstrativos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Exportação de dados comerciais, conciliação fiscal da taxa de 7% e desempenho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar para CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setReportType('sales')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            reportType === 'sales'
              ? 'border-blue-900 text-blue-950 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Relatório de Vendas
        </button>
        <button
          onClick={() => setReportType('invoices')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1 ${
            reportType === 'invoices'
              ? 'border-blue-900 text-blue-950 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
          Demonstrativo Fiscal (NF 7%)
        </button>
        <button
          onClick={() => setReportType('categories')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            reportType === 'categories'
              ? 'border-blue-900 text-blue-950 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Desempenho por Categoria
        </button>
      </div>

      {/* Top summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Faturamento Bruto
          </span>
          <span className="font-serif text-2xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Subtotal Produtos
          </span>
          <span className="font-serif text-2xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(totalSubtotal)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-blue-900 uppercase font-bold tracking-wider block">
            Acréscimo NF (7%)
          </span>
          <span className="font-serif text-2xl font-bold text-blue-950 mt-1 block">
            {formatCurrency(totalInvoiceFees)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Total de Frete
          </span>
          <span className="font-serif text-2xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(totalShipping)}
          </span>
        </div>
      </div>

      {/* Report Content View */}
      {reportType === 'sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-serif font-bold text-slate-900 text-sm">
              Extrato Geral de Vendas ({validOrders.length} pedidos válidos)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Nº Pedido</th>
                  <th className="py-2.5 px-4 font-bold">Data</th>
                  <th className="py-2.5 px-4 font-bold">Cliente</th>
                  <th className="py-2.5 px-4 font-bold">Subtotal</th>
                  <th className="py-2.5 px-4 font-bold">NF (7%)</th>
                  <th className="py-2.5 px-4 font-bold">Frete</th>
                  <th className="py-2.5 px-4 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {validOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {o.order_number}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{formatDateTime(o.created_at)}</td>
                    <td className="py-2.5 px-4 text-slate-800 font-medium">{o.customer.name}</td>
                    <td className="py-2.5 px-4 text-slate-700">{formatCurrency(o.subtotal)}</td>
                    <td className="py-2.5 px-4">
                      {o.has_invoice ? (
                        <span className="text-blue-900 font-bold">
                          +{formatCurrency(o.invoice_fee_amount)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {o.shipping === 0 ? 'Grátis' : formatCurrency(o.shipping)}
                    </td>
                    <td className="py-2.5 px-4 font-serif font-bold text-slate-900">
                      {formatCurrency(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-900" />
              Conciliação de Faturamento e Emissão Fiscal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrativo de pedidos emitidos com ou sem a taxa comercial de {settings.invoice_fee_percentage}%.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <span className="font-bold text-blue-950 block text-sm">
                Pedidos com Nota Fiscal (+7%)
              </span>
              <div className="flex justify-between">
                <span>Quantidade:</span>
                <span className="font-bold text-slate-900">{invoiceOrders.length} pedidos</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal dos produtos:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(invoiceOrders.reduce((s, o) => s + o.subtotal, 0))}
                </span>
              </div>
              <div className="flex justify-between text-blue-950 font-bold pt-2 border-t border-blue-200">
                <span>Total taxa de 7% arrecadada:</span>
                <span>{formatCurrency(totalInvoiceFees)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block text-sm">
                Pedidos sem Emissão de Nota Fiscal
              </span>
              <div className="flex justify-between">
                <span>Quantidade:</span>
                <span className="font-bold text-slate-900">{nonInvoiceOrders.length} pedidos</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal dos produtos:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(nonInvoiceOrders.reduce((s, o) => s + o.subtotal, 0))}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200">
                <span>Acréscimo fiscal:</span>
                <span>R$ 0,00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-serif font-bold text-slate-900 text-sm">
            Faturamento Consolidado por Categoria de Doces
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-bold">Categoria</th>
                <th className="py-2.5 px-4 font-bold">Potes Vendidos</th>
                <th className="py-2.5 px-4 font-bold">Faturamento Total</th>
                <th className="py-2.5 px-4 font-bold">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryStats.map((cat) => {
                const share = totalSubtotal > 0 ? (cat.revenue / totalSubtotal) * 100 : 0;
                return (
                  <tr key={cat.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-600">{cat.quantity} potes</td>
                    <td className="py-3 px-4 font-serif font-bold text-slate-900">
                      {formatCurrency(cat.revenue)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#101e4a] rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {Math.round(share)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
