import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, ShoppingBag, Eye, X, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Customer, Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';

export const AdminCustomersPage: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Compute customers including stats
  const customerListWithStats = useMemo(() => {
    return customers.map((c) => {
      const customerOrders = orders.filter(
        (o) =>
          o.customer.email.toLowerCase() === c.email.toLowerCase() ||
          o.customer.phone === c.phone
      );
      const totalSpent = customerOrders
        .filter((o) => o.status !== 'cancelado')
        .reduce((sum, o) => sum + o.total, 0);

      return {
        ...c,
        ordersCount: customerOrders.length,
        totalSpent,
        orders: customerOrders,
      };
    });
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    return customerListWithStats.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.email.toLowerCase().includes(search.toLowerCase()) &&
        !c.phone.includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [customerListWithStats, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Carteira de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Histórico de compradores, empresas e compras consolidadas da Neuza Doces.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          Total: <strong>{customers.length} clientes cadastrados</strong>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Cliente</th>
                <th className="py-3 px-4 font-bold">Contato</th>
                <th className="py-3 px-4 font-bold">CPF / CNPJ</th>
                <th className="py-3 px-4 font-bold">Total Pedidos</th>
                <th className="py-3 px-4 font-bold">Total Comprado</th>
                <th className="py-3 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-900 border border-blue-200 font-bold flex items-center justify-center text-xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{cust.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {cust.city ? `${cust.city}/${cust.state}` : 'Brasil'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <span className="block font-medium">{cust.email}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{cust.phone}</span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {cust.document || 'Não informado'}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {cust.ordersCount} {cust.ordersCount === 1 ? 'pedido' : 'pedidos'}
                  </td>

                  <td className="py-3 px-4 font-serif font-bold text-blue-950 text-sm">
                    {formatCurrency(cust.totalSpent)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(cust);
                      }}
                      className="p-1.5 rounded-lg text-blue-900 hover:bg-blue-50"
                      title="Ver Histórico"
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

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#101e4a] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">
                    {selectedCustomer.name}
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-slate-500 block">Total de Pedidos</span>
                <span className="font-serif font-bold text-xl text-blue-950">
                  {selectedCustomer.total_orders || selectedCustomer.ordersCount || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-slate-500 block">Faturamento Acumulado</span>
                <span className="font-serif font-bold text-xl text-blue-950">
                  {formatCurrency(selectedCustomer.total_spent || selectedCustomer.totalSpent || 0)}
                </span>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                Histórico de Compras ({selectedCustomer.orders?.length || 0})
              </h3>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs max-h-60 overflow-y-auto">
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  selectedCustomer.orders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="p-3 flex items-center justify-between bg-white hover:bg-slate-50"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(order.created_at)} • {order.items.length} itens
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <span className="font-serif font-bold text-slate-900 text-sm">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    Nenhum pedido registrado para este cliente.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCustomer(null)}
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
