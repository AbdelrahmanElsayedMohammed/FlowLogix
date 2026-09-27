import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ordersApi } from '@/features/orders/api';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Spinner } from '@/shared/components/Spinner';
import { Badge } from '@/shared/components/Badge';
import type { Order, OrderStatus } from '@/lib/api-types';

// Status badge for agent view
const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'neutral' }> = {
  PENDING:    { label: 'معلّق',      variant: 'warning' },
  ASSIGNED:   { label: 'مُعيَّن',    variant: 'info' },
  IN_TRANSIT: { label: 'في الطريق', variant: 'primary' },
  DELIVERED:  { label: 'تم التسليم', variant: 'success' },
  FAILED:     { label: 'فشل',       variant: 'danger' },
  RETURNED:   { label: 'مُعاد',     variant: 'neutral' },
  CANCELLED:  { label: 'ملغي',      variant: 'neutral' },
};

function DeliveryCard({ order, onDeliver, onFail }: {
  order: Order;
  onDeliver: (order: Order) => void;
  onFail: (order: Order) => void;
}) {
  const { formatCurrency } = useFormatters();
  const isActionable = order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT';
  const cfg = statusConfig[order.status];

  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden">
      {/* Coloured top strip */}
      <div className={`h-1.5 ${order.status === 'DELIVERED' ? 'bg-success-500' : order.status === 'FAILED' ? 'bg-danger-500' : 'bg-primary-500'}`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-surface-900 text-lg leading-tight">{order.customerName}</p>
            <p className="text-sm text-surface-500 mt-0.5 font-mono">{order.orderNumber}</p>
          </div>
          <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 bg-surface-50 rounded-xl p-3">
          <span className="text-xl flex-shrink-0">📍</span>
          <div>
            <p className="text-sm font-semibold text-surface-800">{order.deliveryAddress.street}</p>
            <p className="text-xs text-surface-500">{order.deliveryAddress.city}، {order.deliveryAddress.governorate}</p>
            {order.deliveryAddress.notes && <p className="text-xs text-surface-400 mt-1 italic">{order.deliveryAddress.notes}</p>}
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between bg-accent-50 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-accent-800">المبلغ المتوقع</span>
          <span className="text-xl font-extrabold text-accent-700">{formatCurrency(order.totalAmount)}</span>
        </div>

        {/* Contact */}
        <a
          href={`tel:${order.customerPhone}`}
          className="flex items-center gap-3 text-sm text-primary-700 font-semibold hover:underline"
        >
          <span className="text-lg">📞</span>
          {order.customerPhone}
        </a>

        {/* Action buttons — large touch targets for mobile */}
        {isActionable && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => onFail(order)}
              className="h-14 text-base"
            >
              ✗ فشل التسليم
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onDeliver(order)}
              className="h-14 text-base"
            >
              ✓ تم التسليم
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AgentDashboardPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formatCurrency, formatNumber } = useFormatters();

  const [deliverOrder, setDeliverOrder]   = useState<Order | null>(null);
  const [failOrder, setFailOrder]         = useState<Order | null>(null);
  const [cashAmount, setCashAmount]       = useState('');
  const [failureReason, setFailureReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersApi.myOrders({ page: 0, size: 50 }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status, collectedAmount, failureReason }: { id: string; status: OrderStatus; collectedAmount?: number; failureReason?: string }) =>
      ordersApi.updateStatus(id, { status, collectedAmount, failureReason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
      setDeliverOrder(null);
      setFailOrder(null);
      setCashAmount('');
      setFailureReason('');
    },
  });

  const orders = data?.content ?? [];
  const delivered  = orders.filter((o) => o.status === 'DELIVERED').length;
  const failed     = orders.filter((o) => o.status === 'FAILED').length;
  const pending    = orders.filter((o) => ['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(o.status)).length;
  const totalCash  = orders.filter((o) => o.status === 'DELIVERED').reduce((s, o) => s + (o.collectedAmount ?? 0), 0);

  const activeOrders = orders.filter((o) => ['ASSIGNED', 'IN_TRANSIT'].includes(o.status));
  const doneOrders   = orders.filter((o) => ['DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED'].includes(o.status));

  return (
    <div className="min-h-screen bg-surface-50 max-w-md mx-auto">
      {/* Day summary bar */}
      <div className="bg-primary-950 text-white p-5 mb-4">
        <h1 className="text-xl font-extrabold mb-4">{t('agentView.title')}</h1>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'معلّق',         value: formatNumber(pending),   color: 'text-warning-300' },
            { label: 'تم التسليم',   value: formatNumber(delivered), color: 'text-success-300' },
            { label: 'فشل',          value: formatNumber(failed),    color: 'text-danger-300'  },
            { label: 'النقد المحصّل', value: formatCurrency(totalCash), color: 'text-accent-300' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-3">
              <p className={`font-extrabold text-lg ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/60 mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="text-4xl mb-4">🚚</p>
          <p className="text-surface-500 font-medium">{t('agentView.noDeliveries')}</p>
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {/* Active */}
          {activeOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-3 px-1">
                طلبات نشطة ({activeOrders.length})
              </p>
              {activeOrders.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  onDeliver={setDeliverOrder}
                  onFail={setFailOrder}
                />
              ))}
            </div>
          )}

          {/* Completed */}
          {doneOrders.length > 0 && (
            <div className="pb-8">
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-3 px-1">
                مكتملة ({doneOrders.length})
              </p>
              {doneOrders.map((order) => (
                <DeliveryCard key={order.id} order={order} onDeliver={() => {}} onFail={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery confirm modal */}
      <Modal
        isOpen={!!deliverOrder}
        onClose={() => setDeliverOrder(null)}
        title={t('agentView.confirmDelivery')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeliverOrder(null)}>{t('common.cancel')}</Button>
            <Button
              onClick={() => updateStatus.mutate({
                id: deliverOrder!.id,
                status: 'DELIVERED',
                collectedAmount: deliverOrder?.paymentMethod === 'COD' ? parseFloat(cashAmount) || 0 : undefined,
              })}
              loading={updateStatus.isPending}
            >
              {t('agentView.markDelivered')}
            </Button>
          </>
        }
      >
        {deliverOrder && (
          <div className="space-y-4">
            <p className="text-surface-600 text-sm">تأكيد تسليم الطلب <strong>{deliverOrder.orderNumber}</strong> للعميل <strong>{deliverOrder.customerName}</strong></p>
            {deliverOrder.paymentMethod === 'COD' && (
              <Input
                id="cash-amount"
                label={t('agentView.cashAmount')}
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder={String(deliverOrder.totalAmount)}
                helperText={t('agentView.cashNote', { amount: formatNumber(deliverOrder.totalAmount) })}
                leftElement={<span className="text-xs font-bold">ج.م</span>}
                inputMode="numeric"
              />
            )}
          </div>
        )}
      </Modal>

      {/* Failure confirm modal */}
      <Modal
        isOpen={!!failOrder}
        onClose={() => setFailOrder(null)}
        title={t('agentView.confirmFailed')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFailOrder(null)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => updateStatus.mutate({ id: failOrder!.id, status: 'FAILED', failureReason })}
              loading={updateStatus.isPending}
            >
              {t('agentView.markFailed')}
            </Button>
          </>
        }
      >
        {failOrder && (
          <div className="space-y-3">
            <p className="text-surface-600 text-sm">تسجيل فشل تسليم الطلب <strong>{failOrder.orderNumber}</strong></p>
            <Input
              id="failure-reason"
              label={t('agentView.failureReason')}
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              placeholder="مثال: العميل لم يرد على التليفون"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
