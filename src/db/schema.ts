import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users synchronized with Firebase Auth (Google Sign-In)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('admin'), // 'admin' | 'staff'
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

// Orders saved from checkout & commercial negotiations
export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // ORD-XXXXXX
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  customerDocument: text('customer_document'),
  deliveryAddress: text('delivery_address').notNull(),
  notes: text('notes'),
  itemsJson: text('items_json').notNull(),
  totalAmount: text('total_amount').notNull(),
  status: text('status').notNull().default('pending_commercial'), // 'pending_commercial' | 'confirmed' | 'dispatched' | 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
});
