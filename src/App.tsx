import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { useRouter } from './utils/router';
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Store Pages
import { HomePage } from './pages/store/HomePage';
import { ProductsPage } from './pages/store/ProductsPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CartPage } from './pages/store/CartPage';
import { CheckoutPage } from './pages/store/CheckoutPage';
import { OrderSuccessPage } from './pages/store/OrderSuccessPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminStockPage } from './pages/admin/AdminStockPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function AppContent() {
  const { path, navigate } = useRouter();
  const { isAuthenticated } = useStore();

  const isAdminRoute = path.startsWith('/admin');

  // Admin routing logic
  if (isAdminRoute) {
    if (path === '/admin/login') {
      if (isAuthenticated) {
        navigate('/admin');
        return null;
      }
      return <AdminLoginPage onNavigate={navigate} />;
    }

    // Protect all other /admin routes
    if (!isAuthenticated) {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentPath={path} onNavigate={navigate}>
        {path === '/admin' && <AdminDashboardPage onNavigate={navigate} />}
        {path === '/admin/produtos' && <AdminProductsPage onNavigate={navigate} />}
        {path === '/admin/categorias' && <AdminCategoriesPage />}
        {path === '/admin/pedidos' && <AdminOrdersPage />}
        {path === '/admin/clientes' && <AdminCustomersPage />}
        {path === '/admin/estoque' && <AdminStockPage />}
        {path === '/admin/relatorios' && <AdminReportsPage />}
        {path === '/admin/configuracoes' && <AdminSettingsPage />}
      </AdminLayout>
    );
  }

  // Public Store routing logic
  return (
    <StoreLayout currentPath={path} onNavigate={navigate}>
      {path === '/' && <HomePage onNavigate={navigate} />}

      {path === '/produtos' && <ProductsPage onNavigate={navigate} />}

      {path.startsWith('/categoria/') && (
        <ProductsPage
          key={path}
          initialCategorySlug={path.replace('/categoria/', '')}
          onNavigate={navigate}
        />
      )}

      {path.startsWith('/produto/') && (
        <ProductDetailPage slug={path.replace('/produto/', '')} onNavigate={navigate} />
      )}

      {path === '/carrinho' && <CartPage onNavigate={navigate} />}

      {path === '/checkout' && <CheckoutPage onNavigate={navigate} />}

      {path.startsWith('/pedido/') && (
        <OrderSuccessPage orderId={path.replace('/pedido/', '')} onNavigate={navigate} />
      )}
    </StoreLayout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
