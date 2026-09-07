import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Printer,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterInvoice, setFilterInvoice] = useState<'all' | 'with_nf' | 'without_nf'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status updating state in modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('recebido');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (
        search &&
        !o.order_number.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer.name.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (filterStatus !== 'all' && o.status !== filterStatus) {
        return false;
      }
      if (filterInvoice === 'with_nf' && !o.has_invoice) {
        return false;
      }
      if (filterInvoice === 'without_nf' && o.has_invoice) {
        return false;
      }
      return true;
    });
  }, [orders, search, filterStatus, filterInvoice]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Gestão de Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe a emissão de pedidos, status de produção, pagamentos e notas fiscais.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <span>Total: <strong>{orders.length} pedidos</strong></span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nº pedido ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white text-slate-700"
          >
            <option value="all">Todos os Status</option>
            <option value="recebido">Recebido</option>
            <option value="pagamento_confirmado">Pagamento Confirmado</option>
            <option value="em_preparacao">Em Preparação</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Invoice Filter */}
        <div>
          <select
            value={filterInvoice}
            onChange={(e) => setFilterInvoice(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white text-slate-700"
          >
            <option value="all">Todas as Notas Fiscais</option>
            <option value="with_nf">Com Nota Fiscal (+7%)</option>
            <option value="without_nf">Sem Nota Fiscal</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Nº Pedido</th>
                <th className="py-3 px-4 font-bold">Data</th>
                <th className="py-3 px-4 font-bold">Cliente</th>
                <th className="py-3 px-4 font-bold">Itens</th>
                <th className="py-3 px-4 font-bold">Nota Fiscal (7%)</th>
                <th className="py-3 px-4 font-bold">Pagamento</th>
                <th className="py-3 px-4 font-bold">Total</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => handleOpenDetail(order)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold font-mono text-slate-900">
                    {order.order_number}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">
                      {order.customer.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {order.customer.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.length === 1 ? 'item' : 'itens'}
                  </td>
                  <td className="py-3 px-4">
                    {order.has_invoice ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        Sim (+{formatCurrency(order.invoice_fee_amount)})
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Não</span>
                    )}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-600">
                    {order.payment_method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-slate-900 text-sm">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(order);
                      }}
                      className="p-1.5 rounded-lg text-blue-900 hover:bg-blue-50"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Detalhes do Pedido
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  {selectedOrder.order_number}
                </h2>
                <span className="text-xs text-slate-500">
                  Emitido em {formatDateTime(selectedOrder.created_at)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="block font-bold text-slate-700 mb-1">Atualizar Status do Pedido:</span>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="recebido">Recebido</option>
                  <option value="pagamento_confirmado">Pagamento Confirmado</option>
                  <option value="em_preparacao">Em Preparação</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado (Estorna Estoque)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-xl bg-[#101e4a] hover:bg-[#192f75] text-white font-bold transition-all shadow-2xs self-start sm:self-auto"
              >
                Atualizar Status
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">
                  Cliente
                </span>
                <p className="font-semibold text-slate-800">{selectedOrder.customer.name}</p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {selectedOrder.customer.email}
                </p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {selectedOrder.customer.phone}
                </p>
                {selectedOrder.customer.document && (
                  <p className="text-slate-600 font-mono text-[11px]">
                    Doc: {selectedOrder.customer.document}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">
                  Endereço de Entrega
                </span>
                <p className="font-medium text-slate-800">
                  {selectedOrder.address.street}, {selectedOrder.address.number}
                  {selectedOrder.address.complement && ` (${selectedOrder.address.complement})`}
                </p>
                <p className="text-slate-600">
                  {selectedOrder.address.neighborhood} - {selectedOrder.address.city}/
                  {selectedOrder.address.state}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  CEP: {selectedOrder.address.zip_code}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div>
              <span className="font-serif font-bold text-slate-900 text-sm block mb-2">
                Itens Comprados
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{item.product_name}</span>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-950 font-semibold uppercase">
                            {item.sale_type === 'caixa' ? 'Caixa (1X6)' : 'Pote'}
                          </span>
                          <span>
                            {item.quantity} un x {formatCurrency(item.unit_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-slate-100/80 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal dos Produtos</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(selectedOrder.subtotal)}
                </span>
              </div>

              {selectedOrder.has_invoice && (
                <div className="flex justify-between items-center text-blue-950 bg-blue-50 p-2 rounded-lg font-semibold border border-blue-200">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-900" />
                    Acréscimo de Nota Fiscal ({selectedOrder.invoice_fee_percentage}%)
                  </span>
                  <span>+{formatCurrency(selectedOrder.invoice_fee_amount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete</span>
                <span className="font-semibold text-slate-900">
                  {selectedOrder.shipping === 0 ? 'Grátis' : formatCurrency(selectedOrder.shipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Forma de Pagamento</span>
                <span className="font-semibold text-slate-900 uppercase">
                  {selectedOrder.payment_method.replace('_', ' ')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-bold text-sm text-slate-900">
                <span>Total do Pedido</span>
                <span className="font-serif text-xl text-blue-950">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprovante</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#101e4a] text-white font-semibold text-xs hover:bg-[#192f75]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
