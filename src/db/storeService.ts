import { db } from './index.ts';
import { products, categories, customers, orders, storeSettings } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../data/initialData.ts';
import { Product, Category, Customer, Order, StoreSettings, SaleTypeAllowed, ProductLine } from '../types.ts';

// ----------------------------------------------------
// CATEGORIES
// ----------------------------------------------------
export async function getDbCategories(): Promise<Category[]> {
  try {
    const records = await db.select().from(categories);
    if (records.length === 0) {
      // Seed initial categories
      for (const cat of INITIAL_CATEGORIES) {
        await db
          .insert(categories)
          .values({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || null,
            active: cat.active,
          })
          .onConflictDoNothing();
      }
      return INITIAL_CATEGORIES;
    }

    return records.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || undefined,
      active: r.active,
      created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in getDbCategories:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function saveDbCategory(cat: Category): Promise<Category> {
  try {
    await db
      .insert(categories)
      .values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        active: cat.active,
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          active: cat.active,
        },
      });
    return cat;
  } catch (error) {
    console.error('Error in saveDbCategory:', error);
    throw new Error('Failed to save category to database', { cause: error });
  }
}

// ----------------------------------------------------
// PRODUCTS
// ----------------------------------------------------
export async function getDbProducts(): Promise<Product[]> {
  try {
    const records = await db.select().from(products);
    if (records.length === 0) {
      // Seed initial products into PostgreSQL
      for (const prod of INITIAL_PRODUCTS) {
        await db
          .insert(products)
          .values({
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            description: prod.description,
            shortDescription: prod.short_description,
            weight: prod.weight,
            categoryId: prod.category_id,
            line: prod.line,
            packaging: prod.packaging,
            packageQtyInfo: prod.package_qty_info,
            priceUnit: prod.price_unit,
            priceBox: prod.price_box,
            unitsPerBox: prod.units_per_box,
            saleTypeAllowed: prod.sale_type_allowed,
            stock: prod.stock,
            minimumStock: prod.minimum_stock,
            active: prod.active,
            featured: prod.featured,
            imageUrl: prod.image_url,
            galleryJson: JSON.stringify(prod.gallery || [prod.image_url]),
          })
          .onConflictDoNothing();
      }
      return INITIAL_PRODUCTS;
    }

    return records.map((r) => {
      let gallery: string[] = [r.imageUrl];
      try {
        if (r.galleryJson) {
          gallery = JSON.parse(r.galleryJson);
        }
      } catch (_) {}

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || '',
        short_description: r.shortDescription || '',
        weight: r.weight || '',
        category_id: r.categoryId,
        line: (r.line as ProductLine) || 'Doces Tradicionais',
        packaging: r.packaging || '',
        package_qty_info: r.packageQtyInfo || '',
        price_unit: r.priceUnit,
        price_box: r.priceBox,
        units_per_box: r.unitsPerBox,
        sale_type_allowed: (r.saleTypeAllowed as SaleTypeAllowed) || 'both',
        stock: r.stock,
        minimum_stock: r.minimumStock,
        active: r.active,
        featured: r.featured,
        image_url: r.imageUrl,
        gallery,
        created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        updated_at: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error in getDbProducts:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function saveDbProduct(prod: Product): Promise<Product> {
  try {
    await db
      .insert(products)
      .values({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDescription: prod.short_description,
        weight: prod.weight,
        categoryId: prod.category_id,
        line: prod.line,
        packaging: prod.packaging,
        packageQtyInfo: prod.package_qty_info,
        priceUnit: prod.price_unit,
        priceBox: prod.price_box,
        unitsPerBox: prod.units_per_box,
        saleTypeAllowed: prod.sale_type_allowed,
        stock: prod.stock,
        minimumStock: prod.minimum_stock,
        active: prod.active,
        featured: prod.featured,
        imageUrl: prod.image_url,
        galleryJson: JSON.stringify(prod.gallery || [prod.image_url]),
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          shortDescription: prod.short_description,
          weight: prod.weight,
          categoryId: prod.category_id,
          line: prod.line,
          packaging: prod.packaging,
          packageQtyInfo: prod.package_qty_info,
          priceUnit: prod.price_unit,
          priceBox: prod.price_box,
          unitsPerBox: prod.units_per_box,
          saleTypeAllowed: prod.sale_type_allowed,
          stock: prod.stock,
          minimumStock: prod.minimum_stock,
          active: prod.active,
          featured: prod.featured,
          imageUrl: prod.image_url,
          galleryJson: JSON.stringify(prod.gallery || [prod.image_url]),
          updatedAt: new Date(),
        },
      });
    return prod;
  } catch (error) {
    console.error('Error in saveDbProduct:', error);
    throw new Error('Failed to save product to database', { cause: error });
  }
}

export async function updateDbProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const setObj: any = { updatedAt: new Date() };
    if (updates.name !== undefined) setObj.name = updates.name;
    if (updates.slug !== undefined) setObj.slug = updates.slug;
    if (updates.description !== undefined) setObj.description = updates.description;
    if (updates.short_description !== undefined) setObj.shortDescription = updates.short_description;
    if (updates.weight !== undefined) setObj.weight = updates.weight;
    if (updates.category_id !== undefined) setObj.categoryId = updates.category_id;
    if (updates.line !== undefined) setObj.line = updates.line;
    if (updates.packaging !== undefined) setObj.packaging = updates.packaging;
    if (updates.package_qty_info !== undefined) setObj.packageQtyInfo = updates.package_qty_info;
    if (updates.price_unit !== undefined) setObj.priceUnit = updates.price_unit;
    if (updates.price_box !== undefined) setObj.priceBox = updates.price_box;
    if (updates.units_per_box !== undefined) setObj.unitsPerBox = updates.units_per_box;
    if (updates.sale_type_allowed !== undefined) setObj.saleTypeAllowed = updates.sale_type_allowed;
    if (updates.stock !== undefined) setObj.stock = updates.stock;
    if (updates.minimum_stock !== undefined) setObj.minimumStock = updates.minimum_stock;
    if (updates.active !== undefined) setObj.active = updates.active;
    if (updates.featured !== undefined) setObj.featured = updates.featured;
    if (updates.image_url !== undefined) setObj.imageUrl = updates.image_url;
    if (updates.gallery !== undefined) setObj.galleryJson = JSON.stringify(updates.gallery);

    await db.update(products).set(setObj).where(eq(products.id, id));
  } catch (error) {
    console.error('Error in updateDbProduct:', error);
    throw new Error('Failed to update product in database', { cause: error });
  }
}

export async function deleteDbProduct(id: string): Promise<void> {
  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error('Error in deleteDbProduct:', error);
    throw new Error('Failed to delete product from database', { cause: error });
  }
}

// ----------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------
export async function getDbCustomers(): Promise<Customer[]> {
  try {
    const records = await db.select().from(customers);
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email || '',
      phone: r.phone,
      document: r.document || '',
      total_orders: r.totalOrders || 0,
      total_spent: r.totalSpent || 0,
      created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in getDbCustomers:', error);
    return [];
  }
}

export async function saveDbCustomer(cust: Customer): Promise<Customer> {
  try {
    await db
      .insert(customers)
      .values({
        id: cust.id,
        name: cust.name,
        email: cust.email || null,
        phone: cust.phone,
        document: cust.document || null,
        totalOrders: cust.total_orders || 0,
        totalSpent: cust.total_spent || 0,
      })
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          name: cust.name,
          email: cust.email || null,
          phone: cust.phone,
          document: cust.document || null,
          totalOrders: cust.total_orders || 0,
          totalSpent: cust.total_spent || 0,
        },
      });
    return cust;
  } catch (error) {
    console.error('Error in saveDbCustomer:', error);
    throw new Error('Failed to save customer to database', { cause: error });
  }
}

// ----------------------------------------------------
// ORDERS
// ----------------------------------------------------
export async function getDbOrders(): Promise<Order[]> {
  try {
    const records = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return records.map((r) => {
      let items: any[] = [];
      try {
        items = JSON.parse(r.itemsJson);
      } catch (_) {}

      return {
        id: r.id,
        order_number: r.orderNumber || r.id,
        customer_id: r.customerId || 'cust-generic',
        customer: {
          id: r.customerId || 'cust-generic',
          name: r.customerName,
          phone: r.customerPhone,
          email: r.customerEmail || '',
          document: r.customerDocument || '',
          created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        },
        address: {
          street: r.deliveryAddress || '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zip_code: '',
        },
        status: (r.status as any) || 'recebido',
        payment_method: (r.paymentMethod as any) || 'pix',
        subtotal: parseFloat(r.subtotal || r.totalAmount || '0') || 0,
        discount: parseFloat(r.discount || '0') || 0,
        shipping: parseFloat(r.shipping || '0') || 0,
        has_invoice: Boolean(r.hasInvoice),
        invoice_fee_percentage: r.invoiceFeePercentage || 0,
        invoice_fee_amount: r.invoiceFeeAmount || 0,
        total: parseFloat(r.totalAmount || '0') || 0,
        notes: r.notes || undefined,
        items,
        created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        updated_at: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error in getDbOrders:', error);
    return [];
  }
}

export async function saveDbOrder(ord: Order): Promise<Order> {
  try {
    await db
      .insert(orders)
      .values({
        id: ord.id,
        orderNumber: ord.order_number,
        customerId: ord.customer_id,
        customerName: ord.customer.name,
        customerPhone: ord.customer.phone,
        customerEmail: ord.customer.email || null,
        customerDocument: ord.customer.document || null,
        deliveryAddress: `${ord.address.street}, ${ord.address.number} - ${ord.address.neighborhood}, ${ord.address.city} - ${ord.address.state}`,
        status: ord.status,
        paymentMethod: ord.payment_method,
        subtotal: String(ord.subtotal),
        discount: String(ord.discount),
        shipping: String(ord.shipping),
        hasInvoice: ord.has_invoice,
        invoiceFeePercentage: ord.invoice_fee_percentage,
        invoiceFeeAmount: ord.invoice_fee_amount,
        totalAmount: String(ord.total),
        notes: ord.notes || null,
        itemsJson: JSON.stringify(ord.items),
      })
      .onConflictDoNothing();

    return ord;
  } catch (error) {
    console.error('Error in saveDbOrder:', error);
    throw new Error('Failed to save order to database', { cause: error });
  }
}

export async function updateDbOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  } catch (error) {
    console.error('Error in updateDbOrderStatus:', error);
    throw new Error('Failed to update order status in database', { cause: error });
  }
}

// ----------------------------------------------------
// STORE SETTINGS
// ----------------------------------------------------
export async function getDbSettings(): Promise<StoreSettings> {
  try {
    const records = await db.select().from(storeSettings).where(eq(storeSettings.id, 'main'));
    if (records.length === 0) {
      await db
        .insert(storeSettings)
        .values({
          id: 'main',
          settingsJson: JSON.stringify(INITIAL_SETTINGS),
        })
        .onConflictDoNothing();
      return INITIAL_SETTINGS;
    }

    return JSON.parse(records[0].settingsJson);
  } catch (error) {
    console.error('Error in getDbSettings:', error);
    return INITIAL_SETTINGS;
  }
}

export async function saveDbSettings(settings: StoreSettings): Promise<StoreSettings> {
  try {
    await db
      .insert(storeSettings)
      .values({
        id: 'main',
        settingsJson: JSON.stringify(settings),
      })
      .onConflictDoUpdate({
        target: storeSettings.id,
        set: {
          settingsJson: JSON.stringify(settings),
          updatedAt: new Date(),
        },
      });
    return settings;
  } catch (error) {
    console.error('Error in saveDbSettings:', error);
    throw new Error('Failed to save settings to database', { cause: error });
  }
}
