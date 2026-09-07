import React from 'react';
import { OrderStatus } from '../../types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  recebido: { label: 'Pedido Recebido', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  pendente: { label: 'Pagamento Pendente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmado: { label: 'Pagamento Confirmado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  preparacao: { label: 'Em Preparação', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  enviado: { label: 'Enviado', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  entregue: { label: 'Entregue', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  cancelado: { label: 'Cancelado', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const config = ORDER_STATUS_LABELS[status] || {
    label: status,
    color: 'bg-stone-50 text-stone-700 border-stone-200',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {config.label}
    </span>
  );
};

export const StockBadge: React.FC<{ stock: number; minStock: number }> = ({ stock, minStock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        Esgotado
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        Estoque Baixo ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      Disponível ({stock})
    </span>
  );
};
