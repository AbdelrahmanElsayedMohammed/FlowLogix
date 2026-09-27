import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ordersApi } from './api';
import { agentsApi } from '@/features/agents/api';
import { Table, Thead, Tbody, Tr, Th, Td, TableSkeleton, TableEmpty, Pagination } from '@/shared/components/Table';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Select } from '@/shared/components/Select';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { CreateOrderModal } from './components/CreateOrderModal';
import type { OrderStatus } from '@/lib/api-types';

const statusVariant: Record<OrderStatus, 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'> = {
  PENDING:    'warning',
  ASSIGNED:   'info',
  IN_TRANSIT: 'primary',
  DELIVERED:  'success',
  FAILED:     'danger',
  RETURNED:   'neutral',
  CANCELLED:  'neutral',
};

const ALL_STATUSES: OrderStatus[] = ['PENDING','ASSIGNED','IN_TRANSIT','DELIVERED','FAILED','RETURNED','CANCELLED'];

export function OrdersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formatCurrency, formatDate } = useFormatters();
  const [page, setPage]           = useState(0);
  const [status, setStatus]       = useState<OrderStatus | ''>('');
  const [agentId, setAgentId]     = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', { page, status: status || undefined, agentId: agentId || undefined }],
    queryFn: () => ordersApi.list({ page, size: 10, status: status || undefined, agentId: agentId || undefined }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage >= data.totalPages) return;
    void queryClient.prefetchQuery({
      queryKey: ['orders', { page: nextPage, status: status || undefined, agentId: agentId || undefined }],
      queryFn: () =>
        ordersApi.list({ page: nextPage, size: 10, status: status || undefined, agentId: agentId || undefined }),
    });
  }, [agentId, data, page, queryClient, status]);

  const { data: agentsData } = useQuery({
    queryKey: ['agents', 0],
    queryFn: () => agentsApi.list({ page: 0, size: 100 }),
    staleTime: 1000 * 60 * 10,
  });

  const agentOptions = [
    { value: '', label: t('common.all') },
    ...(agentsData?.content.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const statusOptions = [
    { value: '', label: t('common.all') },
    ...ALL_STATUSES.map((s) => ({ value: s, label: t(`orderStatus.${s}`) })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{t('orders.title')}</h1>
        <Button onClick={() => setCreateOpen(true)} leftIcon={<span>+</span>} id="create-order-btn">
          {t('orders.createOrder')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          id="filter-status"
          options={statusOptions}
          value={status}
          onChange={(e) => { setStatus(e.target.value as OrderStatus | ''); setPage(0); }}
          placeholder={t('orders.filterByStatus')}
          containerClassName="w-48"
        />
        <Select
          id="filter-agent"
          options={agentOptions}
          value={agentId}
          onChange={(e) => { setAgentId(e.target.value); setPage(0); }}
          placeholder={t('orders.filterByAgent')}
          containerClassName="w-48"
        />
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>{t('orders.orderNumber')}</Th>
            <Th>{t('orders.customer')}</Th>
            <Th>{t('common.status')}</Th>
            <Th>{t('orders.assignedAgent')}</Th>
            <Th>{t('orders.totalAmount')}</Th>
            <Th>{t('common.date')}</Th>
            <Th>{t('common.actions')}</Th>
          </Tr>
        </Thead>
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : data?.content.length === 0 ? (
          <TableEmpty cols={7} message={t('orders.noOrders')} />
        ) : (
          <Tbody>
            {data?.content.map((order) => (
              <Tr key={order.id}>
                <Td className="font-mono font-semibold text-primary-700">{order.orderNumber}</Td>
                <Td>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-surface-400">{order.deliveryAddress.city}</p>
                  </div>
                </Td>
                <Td>
                  <Badge variant={statusVariant[order.status]}>
                    {t(`orderStatus.${order.status}`)}
                  </Badge>
                </Td>
                <Td>{order.assignedAgentName ?? '—'}</Td>
                <Td className="font-semibold">{formatCurrency(order.totalAmount)}</Td>
                <Td className="text-surface-500 text-xs">{formatDate(order.createdAt)}</Td>
                <Td>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="secondary" size="sm">{t('orders.viewDetails')}</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} size={10} onPageChange={setPage} isLoading={isLoading || isFetching} />
      )}

      <CreateOrderModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
