import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-loaded pages
import { lazy, Suspense } from 'react';
import { FullPageSpinner } from '@/shared/components/Spinner';

function Lazy(factory: () => Promise<{ default: React.ComponentType }>) {
  const Comp = lazy(factory);
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Comp />
    </Suspense>
  );
}

import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';

export const router = createBrowserRouter([
  // ─── Public routes ──────────────────────────────────────────────────────────
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ─── Admin / Manager routes ──────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE_MANAGER']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard',        element: Lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage }))) },
          { path: '/orders',           element: Lazy(() => import('@/features/orders/OrdersPage').then(m => ({ default: m.OrdersPage }))) },
          { path: '/orders/:id',       element: Lazy(() => import('@/features/orders/OrderDetailPage').then(m => ({ default: m.OrderDetailPage }))) },
          { path: '/agents',           element: Lazy(() => import('@/features/agents/AgentsPage').then(m => ({ default: m.AgentsPage }))) },
          { path: '/inventory',        element: Lazy(() => import('@/features/inventory/InventoryPage').then(m => ({ default: m.InventoryPage }))) },
          { path: '/cash-settlement',  element: Lazy(() => import('@/features/cash-settlement/CashSettlementPage').then(m => ({ default: m.CashSettlementPage }))) },
          { path: '/reports',          element: Lazy(() => import('@/features/reports/ReportsPage').then(m => ({ default: m.ReportsPage }))) },
          { path: '/notifications',    element: Lazy(() => import('@/features/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage }))) },
        ],
      },
    ],
  },

  // ─── Agent-only routes ───────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['DELIVERY_AGENT']} />,
    children: [
      { path: '/my-deliveries', element: Lazy(() => import('@/features/agent-view/AgentDashboardPage').then(m => ({ default: m.AgentDashboardPage }))) },
    ],
  },

  // ─── Fallback ────────────────────────────────────────────────────────────────
  { path: '/unauthorized', element: Lazy(() => import('@/features/errors/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage }))) },
  { path: '*',             element: Lazy(() => import('@/features/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage }))) },
]);
