import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { MetricCard } from '@/shared/components/Card';
import { Spinner } from '@/shared/components/Spinner';
import { Badge } from '@/shared/components/Badge';
import { useFormatters } from '@/shared/hooks/useFormatters';
import type { DashboardSummary, Order } from '@/lib/api-types';

function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiClient.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
    refetchInterval: 30_000,
  });
}

function useRecentOrders() {
  return useQuery({
    queryKey: ['orders', { page: 0, size: 5 }],
    queryFn: () => apiClient.get<{ content: Order[] }>('/orders', { params: { page: 0, size: 5 } }).then((r) => r.data),
  });
}

const statusBadge: Record<Order['status'], { variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary' }> = {
  PENDING:    { variant: 'warning' },
  ASSIGNED:   { variant: 'info' },
  IN_TRANSIT: { variant: 'primary' },
  DELIVERED:  { variant: 'success' },
  FAILED:     { variant: 'danger' },
  RETURNED:   { variant: 'neutral' },
  CANCELLED:  { variant: 'neutral' },
};

export function DashboardPage() {
  const { t } = useTranslation();
  const { formatCurrency, formatDateTime, formatNumber, formatTodayLong } = useFormatters();
  const { data: summary, isLoading: summaryLoading } = useDashboard();
  const { data: ordersData, isLoading: ordersLoading } = useRecentOrders();

  const metrics = summary ? [
    { title: t('dashboard.cashCollectedToday'), value: formatCurrency(summary.cashCollectedToday), icon: '💰', color: 'bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300', subtitle: t('common.today') },
    { title: t('dashboard.activeOrders'),       value: formatNumber(summary.activeOrders),         icon: '📦', color: 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300' },
    { title: t('dashboard.deliveredToday'),     value: formatNumber(summary.deliveredToday),       icon: '✅', color: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300' },
    { title: t('dashboard.failedToday'),        value: formatNumber(summary.failedToday),          icon: '❌', color: 'bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300' },
    { title: t('dashboard.lowStockAlerts'),     value: formatNumber(summary.lowStockAlerts),       icon: '⚠️', color: 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300' },
    { title: t('dashboard.activeAgents'),       value: formatNumber(summary.activeAgents),         icon: '🧑‍💼', color: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' },
  ] : [];

  return (
    <div style={{ gap: 'clamp(1rem, 0.75rem + 1.5vw, 2rem)' }} className="flex flex-col w-full max-w-full">
      <div>
        <h1 className="font-extrabold text-surface-900 dark:text-white" style={{ fontSize: 'clamp(1.25rem, 1rem + 1.5vw, 2rem)', lineHeight: 1.2 }}>
          {t('dashboard.title')}
        </h1>
        <p className="text-surface-500 dark:text-slate-400 mt-1" style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)' }}>
          {t('common.today')} — {formatTodayLong()}
        </p>
      </div>

      {/* Metric cards */}
      {summaryLoading ? (
        <div className="flex justify-center" style={{ paddingBlock: 'clamp(2rem, 1.5rem + 3vw, 3rem)' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div
          className="grid w-full"
          style={{
            gap: 'clamp(0.5rem, 0.35rem + 0.8vw, 1rem)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
          }}
        >
          {metrics.map((m) => (
            <MetricCard key={m.title} title={m.title} value={m.value} icon={m.icon} accentColor={m.color} subtitle={m.subtitle} />
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-100 dark:border-slate-800 shadow-card w-full max-w-full overflow-hidden">
        <div
          className="flex items-center justify-between border-b border-surface-100 dark:border-slate-800"
          style={{
            paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
            paddingRight: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
            paddingTop: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem)',
            paddingBottom: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem)',
            gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
          }}
        >
          <h2
            className="font-bold text-surface-900 dark:text-white truncate min-w-0"
            style={{ fontSize: 'clamp(0.9rem, 0.8rem + 0.5vw, 1.125rem)' }}
          >
            {t('dashboard.recentOrders')}
          </h2>
          <Link
            to="/orders"
            className="font-semibold hover:underline text-primary-600 dark:text-primary-400 flex-shrink-0 touch-manipulation tap-highlight-transparent inline-flex items-center justify-center rounded-md"
            style={{
              fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)',
              minHeight: '40px',
              paddingInline: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
            }}
          >
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <div className="divide-y divide-surface-50 dark:divide-slate-800 w-full max-w-full">
          {ordersLoading ? (
            <div className="flex justify-center" style={{ paddingBlock: 'clamp(1.5rem, 1rem + 2vw, 2rem)' }}>
              <Spinner />
            </div>
          ) : (
            ordersData?.content.map((order) => {
              const s = statusBadge[order.status];
              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors w-full max-w-full"
                  style={{
                    paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
                    paddingRight: 'clamp(0.5rem, 0.35rem + 0.8vw, 1.25rem)',
                    paddingTop: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem)',
                    paddingBottom: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem)',
                    gap: 'clamp(0.5rem, 0.35rem + 0.8vw, 1rem)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-surface-900 dark:text-white truncate"
                      style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)' }}
                    >
                      {order.orderNumber}
                    </p>
                    <p
                      className="text-surface-500 dark:text-slate-400 truncate min-w-0"
                      style={{
                        marginTop: 'clamp(1px, 1px + 0.1vw, 2px)',
                        fontSize: 'clamp(0.625rem, 0.6rem + 0.2vw, 0.75rem)',
                      }}
                    >
                      {order.customerName} · {order.deliveryAddress.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 sm:flex-row sm:items-center sm:gap-2" style={{ gap: 'clamp(0.125rem, 0.1rem + 0.2vw, 0.375rem)' }}>
                    <div className="text-end sm:flex-shrink-0">
                      <p
                        className="font-bold text-surface-900 dark:text-white whitespace-nowrap"
                        style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)' }}
                      >
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p
                        className="text-surface-400 dark:text-slate-500 whitespace-nowrap hidden xs:block"
                        style={{
                          marginTop: 'clamp(1px, 1px + 0.1vw, 2px)',
                          fontSize: 'clamp(0.55rem, 0.55rem + 0.15vw, 0.6875rem)',
                        }}
                      >
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <Badge variant={s.variant}>{t(`orderStatus.${order.status}`)}</Badge>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
