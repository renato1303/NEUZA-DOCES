import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Category,
  Customer,
  Order,
  StoreSettings,
  User,
  CartItem,
  SaleType,
  AdminNotification,
  OrderStatus,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { slugify } from '../utils/formatters';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  orders: Order[];
  settings: StoreSettings;
  cart: CartItem[];
  currentUser: User | null;
  isAuthenticated: boolean;
  notifications: AdminNotification[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Order actions
  createOrder: (orderData: {
    customer: Omit<Customer, 'id' | 'created_at'>;
    address: Order['address'];
    items: { product: Product; sale_type: SaleType; quantity: number }[];
    payment_method: Order['payment_method'];
    has_invoice: boolean;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Cart actions
  addToCart: (product: Product, sale_type: SaleType, quantity: number) => void;
  removeFromCart: (productId: string, sale_type: SaleType) => void;
  updateCartQuantity: (productId: string, sale_type: SaleType, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalItems: number;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Auth
  login: (email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;

  // Reset
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'neuza_products_v4',
  CATEGORIES: 'neuza_categories_v4',
  CUSTOMERS: 'neuza_customers_v4',
  ORDERS: 'neuza_orders_v4',
  SETTINGS: 'neuza_settings_v4',
  CART: 'neuza_cart_v4',
  USER: 'neuza_user_v4',
  NOTIFICATIONS: 'neuza_notifications_v4',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const loaded = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    // Always guarantee real local photos (/1.jpeg to /22.jpeg) are applied
    const synced = INITIAL_PRODUCTS.map((initialP) => {
      const existing = loaded.find((p) => p.id === initialP.id);
      return existing
        ? {
            ...existing,
            image_url: initialP.image_url,
            gallery: initialP.gallery,
          }
        : initialP;
    });
    return synced;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const loaded = getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const valid = loaded.filter(c => INITIAL_CATEGORIES.some(ic => ic.id === c.id));
    return valid.length > 0 ? valid : INITIAL_CATEGORIES;
  });
  const [customers, setCustomers] = useState<Customer[]>(() =>
    getStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const loaded = getStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    return {
      ...INITIAL_SETTINGS,
      ...loaded,
      pix_key: loaded.pix_key || INITIAL_SETTINGS.pix_key,
    };
  });
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorage(STORAGE_KEYS.CART, [])
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStorage(STORAGE_KEYS.USER, INITIAL_USER)
  );
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Product Actions
  const addProduct = (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product => {
    const newProduct: Product = {
      ...data,
      id: 'prod-' + Date.now(),
      slug: data.slug || slugify(data.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updated_at: new Date().toISOString() };
          if (updates.name && !updates.slug) {
            updated.slug = slugify(updates.name);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: 'prod-' + Date.now(),
      name: `${target.name} (Cópia)`,
      slug: slugify(`${target.name}-copia-${Date.now()}`),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active, updated_at: new Date().toISOString() } : p))
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    const sanitizedStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: sanitizedStock, updated_at: new Date().toISOString() } : p))
    );
  };

  // Category Actions
  const addCategory = (data: Omit<Category, 'id' | 'created_at'>): Category => {
    const newCategory: Category = {
      ...data,
      id: 'cat-' + Date.now(),
      slug: data.slug || slugify(data.name),
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Customer Actions
  const addCustomer = (data: Omit<Customer, 'id' | 'created_at'>): Customer => {
    const newCustomer: Customer = {
      ...data,
      id: 'cust-' + Date.now(),
      created_at: new Date().toISOString(),
      total_orders: 0,
      total_spent: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Order Actions
  const createOrder = (orderData: {
    customer: Omit<Customer, 'id' | 'created_at'>;
    address: Order['address'];
    items: { product: Product; sale_type: SaleType; quantity: number }[];
    payment_method: Order['payment_method'];
    has_invoice: boolean;
    notes?: string;
  }): Order => {
    // 1. Find or create customer
    let existingCustomer = customers.find(
      (c) =>
        (c.document && c.document === orderData.customer.document) ||
        (c.email && c.email.toLowerCase() === orderData.customer.email.toLowerCase())
    );

    let customerObj: Customer;
    if (!existingCustomer) {
      customerObj = {
        ...orderData.customer,
        id: 'cust-' + Date.now(),
        created_at: new Date().toISOString(),
        total_orders: 1,
        total_spent: 0,
      };
      setCustomers((prev) => [customerObj, ...prev]);
    } else {
      customerObj = existingCustomer;
    }

    // 2. Build order items snapshot and calculate subtotal
    let subtotal = 0;
    const orderItems = orderData.items.map((item, idx) => {
      const unitPrice =
        item.sale_type === 'caixa' ? item.product.price_box : item.product.price_unit;
      const unitsPerPackage = item.sale_type === 'caixa' ? item.product.units_per_box : 1;
      const lineSubtotal = unitPrice * item.quantity;
      subtotal += lineSubtotal;

      return {
        id: `item-${Date.now()}-${idx}`,
        product_id: item.product.id,
        product_name: item.product.name,
        sale_type: item.sale_type,
        quantity: item.quantity,
        unit_price: unitPrice,
        units_per_package: unitsPerPackage,
        subtotal: lineSubtotal,
        image_url: item.product.image_url,
      };
    });

    // 3. Check shipping & invoice surcharge
    const shipping =
      subtotal >= settings.free_shipping_threshold ? 0 : settings.flat_shipping_fee;

    const invoiceFeePct = settings.invoice_fee_percentage || 7;
    const invoiceFeeAmount = orderData.has_invoice
      ? Math.round(subtotal * (invoiceFeePct / 100) * 100) / 100
      : 0;

    const total = Math.round((subtotal + shipping + invoiceFeeAmount) * 100) / 100;

    // 4. Stock deduction rule:
    // When buying a box, decrement by (quantity * units_per_box) pots!
    // Never allow negative stock
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItems = orderData.items.filter((i) => i.product.id === prod.id);
        if (matchingItems.length === 0) return prod;

        let totalPotsDeducted = 0;
        matchingItems.forEach((i) => {
          const multiplier = i.sale_type === 'caixa' ? prod.units_per_box : 1;
          totalPotsDeducted += i.quantity * multiplier;
        });

        const newStock = Math.max(0, prod.stock - totalPotsDeducted);

        // Check if stock became low
        if (newStock <= prod.minimum_stock) {
          setNotifications((notifs) => [
            {
              id: 'notif-' + Date.now() + '-' + prod.id,
              type: newStock === 0 ? 'esgotado' : 'estoque_baixo',
              title: newStock === 0 ? `Produto Esgotado: ${prod.name}` : `Estoque Baixo: ${prod.name}`,
              message:
                newStock === 0
                  ? `O produto ${prod.name} esgotou completamente.`
                  : `Restam apenas ${newStock} potes no estoque (Mínimo: ${prod.minimum_stock}).`,
              read: false,
              created_at: new Date().toISOString(),
              product_id: prod.id,
            },
            ...notifs,
          ]);
        }

        return {
          ...prod,
          stock: newStock,
          updated_at: new Date().toISOString(),
        };
      })
    );

    // 5. Build order object
    const orderNumber = `ND-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      customer_id: customerObj.id,
      customer: customerObj,
      address: orderData.address,
      status: 'recebido',
      payment_method: orderData.payment_method,
      subtotal,
      discount: 0,
      shipping,
      has_invoice: orderData.has_invoice,
      invoice_fee_percentage: invoiceFeePct,
      invoice_fee_amount: invoiceFeeAmount,
      total,
      notes: orderData.notes,
      items: orderItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // 6. Update customer statistics
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerObj.id) {
          return {
            ...c,
            total_orders: (c.total_orders || 0) + 1,
            total_spent: Math.round(((c.total_spent || 0) + total) * 100) / 100,
          };
        }
        return c;
      })
    );

    // 7. Add notification for Admin
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        type: 'pedido',
        title: 'Novo pedido recebido!',
        message: `Pedido #${orderNumber} de ${customerObj.name} no valor de R$ ${total.toFixed(2)}${orderData.has_invoice ? ' com Nota Fiscal (+7%)' : ''}.`,
        read: false,
        created_at: new Date().toISOString(),
        order_id: newOrder.id,
      },
      ...prev,
    ]);

    // 8. Clear cart
    setCart([]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const previousStatus = targetOrder.status;

    // Stock rule: if canceling an order that wasn't already canceled, return stock to products!
    if (newStatus === 'cancelado' && previousStatus !== 'cancelado') {
      setProducts((prev) =>
        prev.map((prod) => {
          const orderItemsForProd = targetOrder.items.filter((i) => i.product_id === prod.id);
          if (orderItemsForProd.length === 0) return prod;

          let returnedPots = 0;
          orderItemsForProd.forEach((item) => {
            const multiplier = item.sale_type === 'caixa' ? item.units_per_package : 1;
            returnedPots += item.quantity * multiplier;
          });

          return {
            ...prod,
            stock: prod.stock + returnedPots,
            updated_at: new Date().toISOString(),
          };
        })
      );

      // Notification of cancellation & stock return
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          type: 'cancelamento',
          title: `Pedido ${targetOrder.order_number} Cancelado`,
          message: `Itens do pedido foram devidamente estornados ao estoque.`,
          read: false,
          created_at: new Date().toISOString(),
          order_id: orderId,
        },
        ...prev,
      ]);
    } else if (previousStatus === 'cancelado' && newStatus !== 'cancelado') {
      // Re-activating order: re-deduct stock
      setProducts((prev) =>
        prev.map((prod) => {
          const orderItemsForProd = targetOrder.items.filter((i) => i.product_id === prod.id);
          if (orderItemsForProd.length === 0) return prod;

          let deductedPots = 0;
          orderItemsForProd.forEach((item) => {
            const multiplier = item.sale_type === 'caixa' ? item.units_per_package : 1;
            deductedPots += item.quantity * multiplier;
          });

          return {
            ...prod,
            stock: Math.max(0, prod.stock - deductedPots),
            updated_at: new Date().toISOString(),
          };
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o
      )
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Cart
  const addToCart = (product: Product, sale_type: SaleType, quantity: number) => {
    setCart((prev) => {
      const unitPrice = sale_type === 'caixa' ? product.price_box : product.price_unit;
      const unitsPerPackage = sale_type === 'caixa' ? product.units_per_box : 1;

      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.sale_type === sale_type
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          sale_type,
          quantity,
          unit_price: unitPrice,
          units_per_package: unitsPerPackage,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, sale_type: SaleType) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.sale_type === sale_type))
    );
  };

  const updateCartQuantity = (productId: string, sale_type: SaleType, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sale_type);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.sale_type === sale_type ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.sale_type === 'caixa' ? item.product.price_box : item.product.price_unit;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Auth
  const login = (email: string, _password?: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Informe um e-mail válido para acessar.' };
    }

    const userName = cleanEmail.includes('renato')
      ? 'Renato Inácio (Admin)'
      : cleanEmail.includes('admin')
      ? 'Neuza Inácio (Admin)'
      : 'Administrador';

    const user: User = {
      id: 'usr-' + Date.now(),
      name: userName,
      email: cleanEmail,
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = Boolean(currentUser);

  // Reset to Demo Data
  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        customers,
        orders,
        settings,
        cart,
        currentUser,
        isAuthenticated,
        notifications,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductActive,
        updateProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addCustomer,
        updateCustomer,
        createOrder,
        updateOrderStatus,
        updateSettings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalItems,
        markNotificationAsRead,
        clearNotifications,
        login,
        logout,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
