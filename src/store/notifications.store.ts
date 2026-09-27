/**
 * notifications.store.ts
 * Zustand store for UI-level notification state.
 * Server data (notification list) is fetched via TanStack Query on load,
 * then WebSocket events push new items here in real-time.
 */
import { create } from 'zustand';
import type { Notification } from '@/lib/api-types';

interface ToastItem {
  id: string;
  notification: Notification;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  toasts: ToastItem[];
  isConnected: boolean;

  // Actions
  setNotifications: (list: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeToast: (id: string) => void;
  setConnected: (connected: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  isConnected: false,

  setNotifications: (list) =>
    set({
      notifications: list,
      unreadCount: list.filter((n) => !n.read).length,
    }),

  addNotification: (notification) => {
    const { notifications } = get();
    // Deduplicate by id
    if (notifications.some((n) => n.id === notification.id)) return;
    const updated = [notification, ...notifications];
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
      toasts: [
        ...get().toasts,
        { id: `toast-${notification.id}`, notification },
      ],
    });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  removeToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  setConnected: (connected) => set({ isConnected: connected }),
}));
