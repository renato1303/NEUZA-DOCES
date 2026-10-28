import express from 'express';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { isAuthorizedAdmin, getAuthorizedAdminsList, getAdminByEmail, getOrCreateUser } from './src/db/users.ts';
import {
  getDbProducts,
  saveDbProduct,
  updateDbProduct,
  deleteDbProduct,
  getDbCategories,
  saveDbCategory,
  getDbCustomers,
  saveDbCustomer,
  getDbOrders,
  saveDbOrder,
  updateDbOrderStatus,
  getDbSettings,
  saveDbSettings,
} from './src/db/storeService.ts';

const app = express();
const port = 3000;

app.use(express.json());

// -------------------------------------------------------------------
// AUTH & LOGIN
// -------------------------------------------------------------------
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, insira um e-mail válido (ex: seu.nome@dominio.com).',
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, insira sua senha.',
      });
    }

    const authorized = await isAuthorizedAdmin(cleanEmail);
    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: 'E-mail não autorizado no banco de dados. Apenas administradores cadastrados podem acessar.',
      });
    }

    const adminRecord = await getAdminByEmail(cleanEmail);
    const adminName =
      adminRecord?.name ||
      (cleanEmail === 'renatoinacio2@gmail.com' ? 'Renato Inácio' : 'Administrador Neuza Doces');

    await getOrCreateUser(`user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`, cleanEmail, adminName);

    res.json({
      success: true,
      user: {
        email: cleanEmail,
        name: adminName,
        role: adminRecord?.role || 'admin',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/admin/login:', err);
    res.status(500).json({ success: false, message: err.message || 'Erro no servidor ao autenticar.' });
  }
});

app.post('/api/admin/check-access', requireAuth, async (req: AuthRequest, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ authorized: false, error: 'E-mail não localizado no token' });
    }

    const authorized = await isAuthorizedAdmin(email);
    if (!authorized) {
      return res.status(403).json({ authorized: false, message: 'Usuário não autorizado' });
    }

    res.json({
      authorized: true,
      email,
      name: req.user?.name || email.split('@')[0],
      uid: req.user?.uid,
    });
  } catch (err: any) {
    console.error('Error in /api/admin/check-access:', err);
    res.status(500).json({ error: err.message || 'Erro ao validar autorização' });
  }
});

// -------------------------------------------------------------------
// PRODUCTS (Catálogo, Preços, Estoques no Banco de Dados)
// -------------------------------------------------------------------
app.get('/api/products', async (_req, res) => {
  try {
    const list = await getDbProducts();
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Erro ao carregar produtos do banco' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const saved = await saveDbProduct(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Erro ao salvar produto no banco' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    await updateDbProduct(req.params.id, req.body);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto no banco' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await deleteDbProduct(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Erro ao excluir produto do banco' });
  }
});

// -------------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------------
app.get('/api/categories', async (_req, res) => {
  try {
    const list = await getDbCategories();
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Erro ao carregar categorias do banco' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const saved = await saveDbCategory(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error saving category:', err);
    res.status(500).json({ error: 'Erro ao salvar categoria no banco' });
  }
});

// -------------------------------------------------------------------
// CUSTOMERS
// -------------------------------------------------------------------
app.get('/api/customers', async (_req, res) => {
  try {
    const list = await getDbCustomers();
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Erro ao carregar clientes do banco' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const saved = await saveDbCustomer(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error saving customer:', err);
    res.status(500).json({ error: 'Erro ao salvar cliente no banco' });
  }
});

// -------------------------------------------------------------------
// ORDERS
// -------------------------------------------------------------------
app.get('/api/orders', async (_req, res) => {
  try {
    const list = await getDbOrders();
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Erro ao carregar pedidos do banco' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const saved = await saveDbOrder(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Erro ao salvar pedido no banco' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await updateDbOrderStatus(req.params.id, status);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// -------------------------------------------------------------------
// STORE SETTINGS
// -------------------------------------------------------------------
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await getDbSettings();
    res.json(settings);
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Erro ao carregar configurações' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const saved = await saveDbSettings(req.body);
    res.json(saved);
  } catch (err: any) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Erro ao salvar configurações no banco' });
  }
});

// -------------------------------------------------------------------
// SERVER INITIALIZATION
// -------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
