import { apiClient } from '@/lib/api-client';
import type { Agent, CreateAgentRequest, UpdateAgentRequest, PaginatedResponse } from '@/lib/api-types';

export const agentsApi = {
  list: (params?: { page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<Agent>>('/agents', { params }).then((r) => r.data),
  get: (id: string) =>
    apiClient.get<Agent>(`/agents/${id}`).then((r) => r.data),
  create: (data: CreateAgentRequest) =>
    apiClient.post<Agent>('/agents', data).then((r) => r.data),
  update: (id: string, data: UpdateAgentRequest) =>
    apiClient.put<Agent>(`/agents/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    apiClient.delete<{ message: string }>(`/agents/${id}`).then((r) => r.data),
};
