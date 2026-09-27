import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ordersApi } from './api';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Spinner } from '@/shared/components/Spinner';
import { useFormatters } from '@/shared/hooks/useFormatters';
import type { OrderStatus } from '@/lib/api-types';

const statusVariant: Record<OrderStatus, 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'> = {
  PENDING:'warning',ASSIGNED:'info',IN_TRANSIT:'primary',DELIVERED:'success',FAILED:'danger',RETURNED:'neutral',CANCELLED:'neutral',
};

export function OrderDetailPage() {
  const { t } = useTranslation();
  const { formatCurrency, formatDateTime, formatNumber } = useFormatters();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.get(id!),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ status }: { status: OrderStatus }) => ordersApi.updateStatus(id!, { status }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['orders', id] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!order) return <p className="text-center text-surface-400 py-20">{t('common.noData')}</p>;

  const s = statusVariant[order.status];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/orders"><Button variant="ghost" size="sm">← {t('common.back')}</Button></Link>
        <div>
          <h1 className="text-xl font-extrabold text-surface-900">{order.orderNumber}</h1>
          <p className="text-sm text-surface-500">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge variant={s} className="ms-auto">{t(`orderStatus.${order.status}`)}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-card space-y-3">
          <h2 className="font-bold text-surface-800 text-sm uppercase tracking-wide">بيانات العميل</h2>
          <p className="font-semibold">{order.customerName}</p>
          <p className="text-sm text-surface-500">{order.customerPhone}</p>
          <p className="text-sm text-surface-500">{order.deliveryAddress.street}، {order.deliveryAddress.city}، {order.deliveryAddress.governorate}</p>
          {order.deliveryAddress.notes && <p className="text-xs text-surface-400 italic">{order.deliveryAddress.notes}</p>}
        </div>

        {/* Finance */}
        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-card space-y-3">
          <h2 className="font-bold text-surface-800 text-sm uppercase tracking-wide">المبالغ</h2>
          <div className="flex justify-between text-sm"><span className="text-surface-500">إجمالي الطلب</span><span className="font-bold">{formatCurrency(order.totalAmount)}</span></div>
          {order.collectedAmount != null && (
            <div className="flex justify-between text-sm"><span className="text-surface-500">المبلغ المحصّل</span><span className="font-bold text-success-700">{formatCurrency(order.collectedAmount)}</span></div>
          )}
          <div className="flex justify-between text-sm"><span className="text-surface-500">طريقة الدفع</span><span className="font-medium">{order.paymentMethod}</span></div>
          {order.assignedAgentName && (
            <div className="flex justify-between text-sm"><span className="text-surface-500">المندوب</span><span className="font-medium">{order.assignedAgentName}</span></div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100">
          <h2 className="font-bold text-surface-800">المنتجات</h2>
        </div>
        <div className="divide-y divide-surface-50">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-surface-400">{item.sku}</p>
              </div>
              <div className="text-end">
                <p className="font-bold text-sm">{formatCurrency(item.unitPrice * item.quantity)}</p>
                <p className="text-xs text-surface-400">{formatNumber(item.quantity)} × {formatCurrency(item.unitPrice)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status actions */}
      {['PENDING', 'ASSIGNED'].includes(order.status) && (
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => updateStatus.mutate({ status: 'CANCELLED' })} loading={updateStatus.isPending}>إلغاء الطلب</Button>
        </div>
      )}
    </div>
  );
}
