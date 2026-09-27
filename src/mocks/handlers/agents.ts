// MOCK – wire to real API once openapi.yaml is provided
import { http, HttpResponse } from 'msw';
import type { Agent, PaginatedResponse } from '@/lib/api-types';

const BASE = '*/api/v1';

const mockAgents: Agent[] = [
  { id: 'agent-1', name: 'محمد علي', phone: '01012345678', zone: 'المعادي', vehicleType: 'MOTORCYCLE', vehiclePlate: 'أ ب ج 1234', status: 'ACTIVE', tenantId: 'tenant-demo', createdAt: '2025-01-15T08:00:00Z' },
  { id: 'agent-2', name: 'أحمد حسن', phone: '01112345678', zone: 'مدينة نصر', vehicleType: 'CAR', vehiclePlate: 'د هـ و 5678', status: 'ACTIVE', tenantId: 'tenant-demo', createdAt: '2025-02-01T08:00:00Z' },
  { id: 'agent-3', name: 'خالد إبراهيم', phone: '01212345678', zone: 'الهرم', vehicleType: 'MOTORCYCLE', status: 'ON_LEAVE', tenantId: 'tenant-demo', createdAt: '2025-03-10T08:00:00Z' },
  { id: 'agent-4', name: 'سامر يوسف', phone: '01512345678', zone: 'شبرا', vehicleType: 'VAN', vehiclePlate: 'ز ح ط 9012', status: 'ACTIVE', tenantId: 'tenant-demo', createdAt: '2025-04-05T08:00:00Z' },
  { id: 'agent-5', name: 'عمر فاروق', phone: '01098765432', zone: 'الدقي', vehicleType: 'CAR', status: 'INACTIVE', tenantId: 'tenant-demo', createdAt: '2025-05-20T08:00:00Z' },
];

export const agentsHandlers = [
  http.get(`${BASE}/agents`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '10');
    const response: PaginatedResponse<Agent> = {
      content: mockAgents.slice(page * size, page * size + size),
      totalElements: mockAgents.length,
      totalPages: Math.ceil(mockAgents.length / size),
      size,
      number: page,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/agents/:id`, ({ params }) => {
    const agent = mockAgents.find((a) => a.id === params['id']);
    if (!agent) return HttpResponse.json({ message: 'المندوب غير موجود' }, { status: 404 });
    return HttpResponse.json(agent);
  }),

  http.post(`${BASE}/agents`, async ({ request }) => {
    const body = await request.json() as Partial<Agent>;
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: body.name ?? '',
      phone: body.phone ?? '',
      zone: body.zone ?? '',
      vehicleType: body.vehicleType ?? 'MOTORCYCLE',
      status: 'ACTIVE',
      tenantId: 'tenant-demo',
      createdAt: new Date().toISOString(),
      nationalId: body.nationalId,
      vehiclePlate: body.vehiclePlate,
    };
    return HttpResponse.json(newAgent, { status: 201 });
  }),

  http.put(`${BASE}/agents/:id`, async ({ params, request }) => {
    const agent = mockAgents.find((a) => a.id === params['id']);
    if (!agent) return HttpResponse.json({ message: 'المندوب غير موجود' }, { status: 404 });
    const body = await request.json() as Partial<Agent>;
    return HttpResponse.json({ ...agent, ...body });
  }),

  http.delete(`${BASE}/agents/:id`, ({ params }) => {
    const exists = mockAgents.some((a) => a.id === params['id']);
    if (!exists) return HttpResponse.json({ message: 'المندوب غير موجود' }, { status: 404 });
    return HttpResponse.json({ message: 'تم حذف المندوب' });
  }),
];
