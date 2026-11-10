import express from 'express';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  isAuthorizedAdmin,
  getAuthorizedAdminsList,
  getAdminByEmail,
  getOrCreateUser,
  createAdminUser,
  deleteAdminUser,
} from './src/db/users.ts';
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
    const rawIdentifier = (
      req.body.username ||
      req.body.user ||
      req.body.usuario ||
      req.body.email ||
      req.body.login ||
      ''
    ).trim();
    const password = (req.body.password || req.body.senha || '').trim();

    if (!rawIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, informe o seu usuário.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, informe sua senha.',
      });
    }

    // Acesso solicitado pelo cliente: Usuário "Master" e senha "Neuza2026$"
    if (rawIdentifier.toLowerCase() === 'master') {
      if (password !== 'Neuza2026$') {
        return res.status(401).json({
          success: false,
          message: 'Usuário ou senha incorretos.',
        });
      }

      await getOrCreateUser('user-master', 'master@neuzadoces.com.br', 'Master');
      return res.json({
        success: true,
        user: {
          username: 'Master',
          email: 'master@neuzadoces.com.br',
          name: 'Master',
          role: 'admin',
        },
      });
    }

    // Suporte para logins com e-mails cadastrados
    const cleanEmail = rawIdentifier.toLowerCase();
    const authorized = await isAuthorizedAdmin(cleanEmail);
    if (authorized) {
      const adminRecord = await getAdminByEmail(cleanEmail);
      const adminName =
        adminRecord?.name ||
        (cleanEmail === 'renatoinacio2@gmail.com' ? 'Renato Inácio' : 'Administrador Neuza Doces');

      await getOrCreateUser(`user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`, cleanEmail, adminName);

      return res.json({
        success: true,
        user: {
          username: cleanEmail,
          email: cleanEmail,
          name: adminName,
          role: adminRecord?.role || 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Usuário ou senha incorretos.',
    });
  } catch (err: any) {
    console.error('Error in /api/admin/login:', err);
    res.status(500).json({ success: false, message: err.message || 'Erro no servidor ao autenticar.' });
  }
});

// Criar novo usuário administrador diretamente
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, informe um endereço de e-mail válido.',
      });
    }

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, informe o nome do usuário.',
      });
    }

    if (!password || password.trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve conter no mínimo 4 caracteres.',
      });
    }

    const newUser = await createAdminUser(cleanEmail, cleanName);

    res.status(201).json({
      success: true,
      message: 'Usuário administrador cadastrado com sucesso!',
      user: {
        email: cleanEmail,
        name: cleanName,
        role: 'admin',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/admin/register:', err);
    res.status(500).json({ success: false, message: err.message || 'Erro ao registrar usuário administrador.' });
  }
});

// Listar administradores cadastrados
app.get('/api/admin/users', async (_req, res) => {
  try {
    const admins = await getAuthorizedAdminsList();
    res.json(admins);
  } catch (err: any) {
    console.error('Error in GET /api/admin/users:', err);
    res.status(500).json({ error: 'Erro ao listar administradores.' });
  }
});

// Excluir administrador cadastrado
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    await deleteAdminUser(id);
    res.json({ success: true, message: 'Administrador removido.' });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/users:', err);
    res.status(500).json({ error: 'Erro ao remover administrador.' });
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
