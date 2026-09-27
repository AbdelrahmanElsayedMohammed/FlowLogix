import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNotificationsStore } from '@/store/notifications.store';
import { cn } from '@/shared/utils/cn';
import type { Notification } from '@/lib/api-types';

interface ToastItemProps {
  id: string;
  notification: Notification;
  onRemove: (id: string) => void;
}

const typeConfig: Record<Notification['type'], { icon: string; color: string; bg: string }> = {
  ORDER_DELIVERED: { icon: '✅', color: 'text-success-700', bg: 'bg-success-50 border-success-200' },
  ORDER_FAILED:    { icon: '❌', color: 'text-danger-700',  bg: 'bg-danger-50 border-danger-200' },
  LOW_STOCK:       { icon: '⚠️', color: 'text-warning-700', bg: 'bg-warning-50 border-warning-200' },
  AGENT_ASSIGNED:  { icon: '👤', color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200' },
  CASH_MISMATCH:   { icon: '💰', color: 'text-danger-700',  bg: 'bg-danger-50 border-danger-200' },
  SYSTEM:          { icon: 'ℹ️', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
};

function ToastItem({ id, notification, onRemove }: ToastItemProps) {
  const config = typeConfig[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={cn(
        'toast-enter flex items-start gap-3 p-4 rounded-xl border shadow-card-hover min-w-72 max-w-sm',
        config.bg,
      )}
      role="alert"
      aria-live="polite"
    >
      <span className="text-xl flex-shrink-0 leading-none mt-0.5" aria-hidden="true">
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-bold truncate', config.color)}>{notification.title}</p>
        <p className="text-xs text-surface-600 mt-0.5 line-clamp-2">{notification.message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-surface-400 hover:text-surface-700 transition-colors -mt-0.5"
        aria-label="إغلاق"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useNotificationsStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed bottom-6 start-6 z-[60] flex flex-col gap-3"
      aria-label="إشعارات"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          notification={t.notification}
          onRemove={removeToast}
        />
      ))}
    </div>,
    document.body,
  );
}
