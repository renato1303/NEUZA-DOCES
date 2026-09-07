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

  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const isAdminRoute = cleanPath.startsWith('/admin');

  // Admin routing logic
  if (isAdminRoute) {
    if (cleanPath === '/admin/login') {
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
      <AdminLayout currentPath={cleanPath} onNavigate={navigate}>
        {(cleanPath === '/admin' || cleanPath === '/admin/dashboard') && (
          <AdminDashboardPage onNavigate={navigate} />
        )}
        {cleanPath === '/admin/produtos' && <AdminProductsPage onNavigate={navigate} />}
        {cleanPath === '/admin/categorias' && <AdminCategoriesPage />}
        {cleanPath === '/admin/pedidos' && <AdminOrdersPage />}
        {cleanPath === '/admin/clientes' && <AdminCustomersPage />}
        {cleanPath === '/admin/estoque' && <AdminStockPage />}
        {cleanPath === '/admin/relatorios' && <AdminReportsPage />}
        {cleanPath === '/admin/configuracoes' && <AdminSettingsPage />}
        {/* Fallback for other /admin paths */}
        {![
          '/admin',
          '/admin/dashboard',
          '/admin/produtos',
          '/admin/categorias',
          '/admin/pedidos',
          '/admin/clientes',
          '/admin/estoque',
          '/admin/relatorios',
          '/admin/configuracoes',
        ].includes(cleanPath) && <AdminDashboardPage onNavigate={navigate} />}
      </AdminLayout>
    );
  }

  // Public Store routing logic
  return (
    <StoreLayout currentPath={cleanPath} onNavigate={navigate}>
      {cleanPath === '/' && <HomePage onNavigate={navigate} />}

      {cleanPath === '/produtos' && <ProductsPage onNavigate={navigate} />}

      {cleanPath.startsWith('/categoria/') && (
        <ProductsPage
          key={cleanPath}
          initialCategorySlug={cleanPath.replace('/categoria/', '')}
          onNavigate={navigate}
        />
      )}

      {cleanPath.startsWith('/produto/') && (
        <ProductDetailPage slug={cleanPath.replace('/produto/', '')} onNavigate={navigate} />
      )}

      {cleanPath === '/carrinho' && <CartPage onNavigate={navigate} />}

      {cleanPath === '/checkout' && <CheckoutPage onNavigate={navigate} />}

      {cleanPath.startsWith('/pedido/') && (
        <OrderSuccessPage orderId={cleanPath.replace('/pedido/', '')} onNavigate={navigate} />
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
