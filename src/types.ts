export type SaleType = 'pote' | 'caixa';
export type SaleTypeAllowed = 'pote' | 'caixa' | 'both';

export type ProductLine = 'Doces Tradicionais';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  weight: string;
  category_id: string;
  line: ProductLine;
  packaging: string; // e.g. "CX 1X6"
  package_qty_info: string; // e.g. "20 unidades"
  price_unit: number; // Preço por pote
  price_box: number; // Preço da caixa
  units_per_box: number; // Potes por caixa (default 6)
  sale_type_allowed: SaleTypeAllowed;
  stock: number; // Estoque em potes individuais
  minimum_stock: number;
  active: boolean;
  featured: boolean;
  image_url: string;
  gallery: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  created_at: string;
  total_orders?: number;
  total_spent?: number;
}

export interface Address {
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sale_type: SaleType;
  quantity: number;
  unit_price: number; // snapshot at order time
  units_per_package: number; // 1 for pote, units_per_box for caixa
  subtotal: number;
  image_url?: string;
}

export type OrderStatus =
  | 'recebido'
  | 'pendente'
  | 'confirmado'
  | 'preparacao'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer: Customer;
  address: Address;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  has_invoice: boolean;
  invoice_fee_percentage: number; // e.g. 7
  invoice_fee_amount: number;
  total: number;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  sale_type: SaleType;
  quantity: number;
  unit_price: number;
  units_per_package: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  logo: string;
  phone: string;
  whatsapp: string;
  email: string;
  zip_code: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  invoice_fee_percentage: number; // Default 7
  minimum_order_value: number;
  free_shipping_threshold: number;
  flat_shipping_fee: number;
  pix_key: string;
}

export type PeriodFilter =
  | 'hoje'
  | 'ontem'
  | '7dias'
  | '30dias'
  | 'este_mes'
  | 'mes_anterior'
  | 'este_ano'
  | 'todos';

export type DashboardPeriod =
  | 'hoje'
  | 'ontem'
  | '7dias'
  | '30dias'
  | 'mes_atual'
  | 'ano_atual'
  | 'todos';

export interface AdminNotification {
  id: string;
  type: 'pedido' | 'estoque_baixo' | 'esgotado' | 'cancelamento' | 'cliente';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  order_id?: string;
  product_id?: string;
}
