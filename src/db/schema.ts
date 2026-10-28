import { pgTable, serial, text, timestamp, boolean, integer, doublePrecision } from 'drizzle-orm/pg-core';

// Users synchronized with Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Authorized admin allowlist & credentials
export const authorizedAdmins = pgTable('authorized_admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products Table (Catalog, Prices, Stock, Inventory)
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  weight: text('weight'),
  categoryId: text('category_id').notNull(),
  line: text('line').default('Doces Tradicionais'),
  packaging: text('packaging'),
  packageQtyInfo: text('package_qty_info'),
  priceUnit: doublePrecision('price_unit').notNull(),
  priceBox: doublePrecision('price_box').notNull(),
  unitsPerBox: integer('units_per_box').notNull().default(6),
  saleTypeAllowed: text('sale_type_allowed').notNull().default('both'),
  stock: integer('stock').notNull().default(0),
  minimumStock: integer('minimum_stock').notNull().default(0),
  active: boolean('active').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  imageUrl: text('image_url').notNull(),
  galleryJson: text('gallery_json'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Customers Table (Registered clients and purchase stats)
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  document: text('document'),
  totalOrders: integer('total_orders').default(0),
  totalSpent: doublePrecision('total_spent').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders Table (Orders, items, commercial details)
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number'),
  customerId: text('customer_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  customerDocument: text('customer_document'),
  deliveryAddress: text('delivery_address').notNull(),
  status: text('status').notNull().default('recebido'),
  paymentMethod: text('payment_method').default('pix'),
  subtotal: text('subtotal'),
  discount: text('discount'),
  shipping: text('shipping'),
  hasInvoice: boolean('has_invoice').default(false),
  invoiceFeePercentage: doublePrecision('invoice_fee_percentage').default(0),
  invoiceFeeAmount: doublePrecision('invoice_fee_amount').default(0),
  totalAmount: text('total_amount').notNull(),
  notes: text('notes'),
  itemsJson: text('items_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Store Settings & Parameters Table
export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey(),
  settingsJson: text('settings_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
