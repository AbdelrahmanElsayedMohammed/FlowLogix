import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationsStore } from '@/store/notifications.store';
import { useNotifications } from './hooks/useNotifications';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { cn } from '@/shared/utils/cn';
import type { Notification } from '@/lib/api-types';

const typeIcon: Record<Notification['type'], string> = {
  ORDER_DELIVERED: '✅',
  ORDER_FAILED:    '❌',
  LOW_STOCK:       '⚠️',
  AGENT_ASSIGNED:  '👤',
  CASH_MISMATCH:   '💰',
  SYSTEM:          'ℹ️',
};

export function NotificationDropdown() {
  const { t } = useTranslation();
  const { timeAgo, formatNumber } = useFormatters();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isConnected } = useNotificationsStore();
  const { markRead, markAllRead } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        id="notifications-bell"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg text-surface-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors min-touch-sm tap-highlight-transparent touch-manipulation flex items-center justify-center flex-shrink-0"
        style={{
          padding: 'clamp(0.375rem, 0.3rem + 0.3vw, 0.625rem)',
        }}
        aria-label={`${t('notifications.title')} (${formatNumber(unreadCount)} ${t('notifications.unread')})`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute end-1 bg-danger-600 text-white font-bold rounded-full flex items-center justify-center animate-bounce-in"
            style={{
              top: 'clamp(4px, 3px + 0.3vw, 6px)',
              minWidth: 'clamp(18px, 16px + 0.8vw, 22px)',
              height: 'clamp(18px, 16px + 0.8vw, 22px)',
              paddingInline: 'clamp(2px, 1px + 0.3vw, 4px)',
              fontSize: 'clamp(0.6rem, 0.55rem + 0.2vw, 0.7rem)',
            }}
          >
            {unreadCount > 99 ? '99+' : formatNumber(unreadCount)}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute end-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-modal border border-surface-100 dark:border-slate-800 z-50 animate-scale-in overflow-hidden"
          role="menu"
          aria-label={t('notifications.title')}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-surface-100 dark:border-slate-800"
            style={{
              paddingLeft: 'clamp(0.75rem, 0.65rem + 0.5vw, 1rem)',
              paddingRight: 'clamp(0.75rem, 0.65rem + 0.5vw, 1rem)',
              paddingTop: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.75rem)',
              paddingBottom: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.75rem)',
            }}
          >
            <h3
              className="font-bold text-surface-900 dark:text-white"
              style={{ fontSize: 'clamp(0.85rem, 0.8rem + 0.3vw, 1rem)' }}
            >
              {t('notifications.title')}
            </h3>
            <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.3rem + 0.3vw, 0.5rem)' }}>
              <span className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-success-500' : 'bg-surface-300 dark:bg-slate-600')} title={isConnected ? t('notifications.connected') : t('notifications.disconnected')} />
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium touch-manipulation tap-highlight-transparent inline-flex items-center justify-center rounded-md"
                  style={{
                    minHeight: '36px',
                    paddingInline: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
                    fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.8125rem)',
                  }}
                >
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-surface-50 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <p
                className="text-center text-surface-400 dark:text-slate-500"
                style={{
                  paddingBlock: 'clamp(1.5rem, 1.25rem + 2vw, 2rem)',
                  fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
                }}
              >
                {t('notifications.noNotifications')}
              </p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); }}
                  role="menuitem"
                  className={cn(
                    'w-full text-start flex items-start hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors touch-manipulation tap-highlight-transparent',
                    !n.read && 'bg-primary-50/50 dark:bg-primary-950/30',
                  )}
                  style={{
                    minHeight: '64px',
                    paddingLeft: 'clamp(0.75rem, 0.65rem + 0.5vw, 1rem)',
                    paddingRight: 'clamp(0.75rem, 0.65rem + 0.5vw, 1rem)',
                    paddingTop: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.75rem)',
                    paddingBottom: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.75rem)',
                    gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)' }}
                    aria-hidden="true"
                  >
                    {typeIcon[n.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between" style={{ gap: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.5rem)' }}>
                      <p
                        className={cn('font-semibold truncate', !n.read ? 'text-surface-900 dark:text-white' : 'text-surface-600 dark:text-slate-400')}
                        style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)' }}
                      >
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" aria-label="غير مقروء" />}
                    </div>
                    <p
                      className="text-surface-500 dark:text-slate-400 line-clamp-2"
                      style={{
                        marginTop: 'clamp(2px, 1px + 0.2vw, 4px)',
                        fontSize: 'clamp(0.6875rem, 0.65rem + 0.2vw, 0.8125rem)',
                      }}
                    >
                      {n.message}
                    </p>
                    <p
                      className="text-surface-400 dark:text-slate-500"
                      style={{
                        marginTop: 'clamp(2px, 1px + 0.2vw, 4px)',
                        fontSize: 'clamp(0.6rem, 0.57rem + 0.15vw, 0.7rem)',
                      }}
                    >
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
