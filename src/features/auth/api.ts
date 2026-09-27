import { apiClient } from '@/lib/api-client';
import type { LoginRequest, LoginResponse, RegisterTenantRequest, AuthUser } from '@/lib/api-types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterTenantRequest) =>
    apiClient.post<{ message: string }>('/auth/register', data).then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<LoginResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),

  me: () =>
    apiClient.get<AuthUser>('/auth/me').then((r) => r.data),

  logout: () =>
    apiClient.post<{ message: string }>('/auth/logout').then((r) => r.data),
};
