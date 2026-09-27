import { apiClient } from '@/lib/api-client';
import type { Order, CreateOrderRequest, AssignOrderRequest, UpdateOrderStatusRequest, PaginatedResponse, OrderListParams } from '@/lib/api-types';

export const ordersApi = {
  list: (params?: OrderListParams) =>
    apiClient.get<PaginatedResponse<Order>>('/orders', { params }).then((r) => r.data),
  get: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`).then((r) => r.data),
  create: (data: CreateOrderRequest) =>
    apiClient.post<Order>('/orders', data).then((r) => r.data),
  assign: (id: string, data: AssignOrderRequest) =>
    apiClient.patch<Order>(`/orders/${id}/assign`, data).then((r) => r.data),
  updateStatus: (id: string, data: UpdateOrderStatusRequest) =>
    apiClient.patch<Order>(`/orders/${id}/status`, data).then((r) => r.data),
  myOrders: (params?: { page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<Order>>('/orders/my', { params }).then((r) => r.data),
};
