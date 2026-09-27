/**
 * useNotifications.ts
 *
 * Single hook mounted ONCE at the app root (in App.tsx).
 * 1. Fetches unread notifications via REST on mount.
 * 2. Opens the WebSocket connection.
 * 3. WebSocket events push into Zustand store (handled in ws-client.ts).
 * 4. Exposes markRead / markAllRead mutations.
 */
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { useSettingsStore } from '@/store/settings.store';
import { wsClient } from '@/lib/ws-client';
import { notificationsApi } from '../api';

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const { setNotifications, markAsRead, markAllAsRead } = useNotificationsStore();
  const queryClient = useQueryClient();

  // 1. Fetch from REST on load
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll,
    enabled: isAuthenticated && notificationsEnabled,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data, setNotifications]);

  // 2. Connect WebSocket
  useEffect(() => {
    if (!isAuthenticated || !notificationsEnabled) {
      wsClient.disconnect();
      return;
    }
    wsClient.connect();
    return () => {
      // Don't disconnect on re-render — only disconnect on logout
    };
  }, [isAuthenticated, notificationsEnabled]);

  // 3. Mark single read
  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: (_, id) => {
      markAsRead(id);
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 4. Mark all read
  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      markAllAsRead();
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
}
