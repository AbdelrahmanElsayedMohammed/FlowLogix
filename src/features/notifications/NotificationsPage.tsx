import { useTranslation } from 'react-i18next';
import { useNotificationsStore } from '@/store/notifications.store';
import { useNotifications } from './hooks/useNotifications';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { cn } from '@/shared/utils/cn';
import type { Notification } from '@/lib/api-types';

const typeIcon: Record<Notification['type'], string> = {
  ORDER_DELIVERED: '✅', ORDER_FAILED: '❌', LOW_STOCK: '⚠️',
  AGENT_ASSIGNED: '👤', CASH_MISMATCH: '💰', SYSTEM: 'ℹ️',
};

export function NotificationsPage() {
  const { t } = useTranslation();
  const { timeAgo, formatNumber } = useFormatters();
  const { notifications, unreadCount } = useNotificationsStore();
  const { markRead, markAllRead } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900">{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-surface-500 mt-1">{formatNumber(unreadCount)} {t('notifications.unread')}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllRead()} className="text-sm text-primary-600 font-semibold hover:underline">
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 shadow-card divide-y divide-surface-50">
        {notifications.length === 0 ? (
          <p className="text-center text-surface-400 py-16">{t('notifications.noNotifications')}</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn('flex items-start gap-4 p-5 cursor-pointer hover:bg-surface-50 transition-colors', !n.read && 'bg-primary-50/40')}
            >
              <span className="text-2xl flex-shrink-0">{typeIcon[n.type]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={cn('font-bold', !n.read ? 'text-surface-900' : 'text-surface-600')}>{n.title}</p>
                  {!n.read && <span className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                </div>
                <p className="text-sm text-surface-600 mt-1">{n.message}</p>
                <p className="text-xs text-surface-400 mt-2">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
