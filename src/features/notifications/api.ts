import { apiClient } from '@/lib/api-client';
import type { Notification } from '@/lib/api-types';

export const notificationsApi = {
  getAll: () => apiClient.get<Notification[]>('/notifications').then((r) => r.data),
  markRead: (id: string) => apiClient.patch<Notification>(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => apiClient.post<{ message: string }>('/notifications/read-all').then((r) => r.data),
};
