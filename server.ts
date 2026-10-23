import express from 'express';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { isAuthorizedAdmin, getAuthorizedAdminsList } from './src/db/users.ts';
import { getAllOrders, saveOrder, updateOrderStatus } from './src/db/orders.ts';

const app = express();
const port = 3000;

app.use(express.json());

// API: Verify Admin Access via Cloud SQL & Firebase ID Token
app.post('/api/admin/check-access', requireAuth, async (req: AuthRequest, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ authorized: false, error: 'E-mail não localizado no token de autenticação' });
    }

    const authorized = await isAuthorizedAdmin(email);
    if (!authorized) {
      return res.status(403).json({ authorized: false, message: 'Usuário não autorizado para a Área Restrita' });
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

// API: Get Orders (Protected Admin Route)
app.get('/api/admin/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const list = await getAllOrders();
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: err.message || 'Erro ao consultar pedidos' });
  }
});

// API: Update Order Status (Protected Admin Route)
app.patch('/api/admin/orders/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateOrderStatus(id, status);
    res.json(updated);
  } catch (err: any) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: err.message || 'Erro ao atualizar pedido' });
  }
});

// API: Record Order from Store Checkout (Public)
app.post('/api/orders', async (req, res) => {
  try {
    const saved = await saveOrder(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error saving order from store:', err);
    res.status(500).json({ error: err.message || 'Erro ao registrar pedido' });
  }
});

// Start server with Vite middleware in dev or static files in production
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
