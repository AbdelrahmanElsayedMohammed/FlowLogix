// MOCK – wire to real API once openapi.yaml is provided
import { http, HttpResponse } from 'msw';
import type { LoginResponse, AuthUser } from '@/lib/api-types';

const BASE = '*/api/v1';

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'أحمد المسؤول',
  email: 'admin@flowlogix.io',
  role: 'ADMIN',
  tenantId: 'tenant-demo',
  avatarUrl: undefined,
};

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.password === 'wrong') {
      return HttpResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }
    const response: LoginResponse = {
      accessToken: 'mock-access-token-jwt',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      user: mockUser,
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/auth/refresh`, () => {
    const response: LoginResponse = {
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token-2',
      expiresIn: 3600,
      user: mockUser,
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/auth/register`, () => {
    return HttpResponse.json({ message: 'تم إنشاء الحساب بنجاح' }, { status: 201 });
  }),

  http.get(`${BASE}/auth/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.post(`${BASE}/auth/logout`, () => {
    return HttpResponse.json({ message: 'تم تسجيل الخروج' });
  }),
];
