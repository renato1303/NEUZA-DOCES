import { db } from './index.ts';
import { orders } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateOrderInput {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerDocument?: string;
  deliveryAddress: string;
  notes?: string;
  itemsJson: string;
  totalAmount: string;
  status?: string;
}

export async function saveOrder(orderData: CreateOrderInput) {
  try {
    const result = await db
      .insert(orders)
      .values({
        id: orderData.id,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail || null,
        customerDocument: orderData.customerDocument || null,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes || null,
        itemsJson: orderData.itemsJson,
        totalAmount: orderData.totalAmount,
        status: orderData.status || 'pending_commercial',
      })
      .onConflictDoNothing()
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error saving order to Cloud SQL:', error);
    throw new Error('Failed to save order to database', { cause: error });
  }
}

export async function getAllOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Error retrieving orders from Cloud SQL:', error);
    throw new Error('Failed to retrieve orders from database', { cause: error });
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error updating order status in Cloud SQL:', error);
    throw new Error('Failed to update order status', { cause: error });
  }
}
