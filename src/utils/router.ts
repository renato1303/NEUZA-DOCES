import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
}

export function parseRoute(currentPath: string): RouteState {
  const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

  // /produto/:slug
  const productMatch = cleanPath.match(/^\/produto\/([^/]+)/);
  if (productMatch) {
    return { path: '/produto', params: { slug: productMatch[1] } };
  }

  // /categoria/:slug
  const categoryMatch = cleanPath.match(/^\/categoria\/([^/]+)/);
  if (categoryMatch) {
    return { path: '/categoria', params: { slug: categoryMatch[1] } };
  }

  // /pedido/:id
  const orderMatch = cleanPath.match(/^\/pedido\/([^/]+)/);
  if (orderMatch) {
    return { path: '/pedido', params: { id: orderMatch[1] } };
  }

  // /admin/produtos/:id
  const adminProductMatch = cleanPath.match(/^\/admin\/produtos\/([^/]+)/);
  if (adminProductMatch && adminProductMatch[1] !== 'novo') {
    return { path: '/admin/produtos/editar', params: { id: adminProductMatch[1] } };
  }

  // /admin/pedidos/:id
  const adminOrderMatch = cleanPath.match(/^\/admin\/pedidos\/([^/]+)/);
  if (adminOrderMatch) {
    return { path: '/admin/pedidos/detalhes', params: { id: adminOrderMatch[1] } };
  }

  // /admin/clientes/:id
  const adminCustomerMatch = cleanPath.match(/^\/admin\/clientes\/([^/]+)/);
  if (adminCustomerMatch) {
    return { path: '/admin/clientes/detalhes', params: { id: adminCustomerMatch[1] } };
  }

  return { path: cleanPath, params: {} };
}

export function useRouter() {
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to !== currentUrl) {
      window.history.pushState({}, '', to);
      setCurrentUrl(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const route = parseRoute(currentUrl);

  return {
    currentUrl,
    path: currentUrl,
    route,
    navigate,
  };
}
