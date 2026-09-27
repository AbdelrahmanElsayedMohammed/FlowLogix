// MOCK – wire to real API once openapi.yaml is provided
import { http, HttpResponse } from 'msw';
import type { Order, PaginatedResponse } from '@/lib/api-types';

const BASE = '*/api/v1';

const mockOrders: Order[] = [
  {
    id: 'ord-1', orderNumber: 'FL-2026-0001', customerName: 'ريم أحمد', customerPhone: '01001234567',
    deliveryAddress: { street: 'شارع التحرير 12', city: 'القاهرة', governorate: 'القاهرة' },
    items: [{ productId: 'prod-1', productName: 'لاب توب ديل', sku: 'DELL-001', quantity: 1, unitPrice: 25000 }],
    totalAmount: 25000, paymentMethod: 'COD', status: 'IN_TRANSIT',
    assignedAgentId: 'agent-1', assignedAgentName: 'محمد علي',
    createdAt: '2026-07-28T08:00:00Z', updatedAt: '2026-07-28T10:00:00Z', tenantId: 'tenant-demo',
  },
  {
    id: 'ord-2', orderNumber: 'FL-2026-0002', customerName: 'كريم محمود', customerPhone: '01112345678',
    deliveryAddress: { street: 'ميدان المحطة 5', city: 'الجيزة', governorate: 'الجيزة' },
    items: [
      { productId: 'prod-2', productName: 'تابلت سامسونج', sku: 'SAM-TAB-001', quantity: 2, unitPrice: 8500 },
    ],
    totalAmount: 17000, paymentMethod: 'COD', status: 'PENDING',
    createdAt: '2026-07-28T09:00:00Z', updatedAt: '2026-07-28T09:00:00Z', tenantId: 'tenant-demo',
  },
  {
    id: 'ord-3', orderNumber: 'FL-2026-0003', customerName: 'سارة إبراهيم', customerPhone: '01212345678',
    deliveryAddress: { street: 'شارع الهرم 88', city: 'الجيزة', governorate: 'الجيزة' },
    items: [{ productId: 'prod-3', productName: 'هاتف آيفون 15', sku: 'APL-IP15', quantity: 1, unitPrice: 35000 }],
    totalAmount: 35000, collectedAmount: 35000, paymentMethod: 'COD', status: 'DELIVERED',
    assignedAgentId: 'agent-2', assignedAgentName: 'أحمد حسن',
    createdAt: '2026-07-27T10:00:00Z', updatedAt: '2026-07-27T16:00:00Z',
    deliveredAt: '2026-07-27T16:00:00Z', tenantId: 'tenant-demo',
  },
  {
    id: 'ord-4', orderNumber: 'FL-2026-0004', customerName: 'محمد سلامة', customerPhone: '01512345678',
    deliveryAddress: { street: 'شارع رمسيس 45', city: 'القاهرة', governorate: 'القاهرة' },
    items: [{ productId: 'prod-4', productName: 'شاشة LG 27 بوصة', sku: 'LG-MON-27', quantity: 1, unitPrice: 12000 }],
    totalAmount: 12000, paymentMethod: 'PREPAID', status: 'ASSIGNED',
    assignedAgentId: 'agent-4', assignedAgentName: 'سامر يوسف',
    createdAt: '2026-07-28T07:00:00Z', updatedAt: '2026-07-28T08:30:00Z', tenantId: 'tenant-demo',
  },
  {
    id: 'ord-5', orderNumber: 'FL-2026-0005', customerName: 'دينا حسين', customerPhone: '01098765432',
    deliveryAddress: { street: 'شارع الحجاز 3', city: 'القاهرة', governorate: 'القاهرة' },
    items: [{ productId: 'prod-1', productName: 'لاب توب ديل', sku: 'DELL-001', quantity: 1, unitPrice: 25000 }],
    totalAmount: 25000, paymentMethod: 'COD', status: 'FAILED',
    assignedAgentId: 'agent-1', assignedAgentName: 'محمد علي',
    notes: 'العميل لم يرد على التليفون',
    createdAt: '2026-07-27T11:00:00Z', updatedAt: '2026-07-27T15:00:00Z', tenantId: 'tenant-demo',
  },
];

export const ordersHandlers = [
  http.get(`${BASE}/orders`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '10');
    const statusFilter = url.searchParams.get('status');
    const agentFilter = url.searchParams.get('agentId');
    let filtered = [...mockOrders];
    if (statusFilter) filtered = filtered.filter((o) => o.status === statusFilter);
    if (agentFilter) filtered = filtered.filter((o) => o.assignedAgentId === agentFilter);
    const response: PaginatedResponse<Order> = {
      content: filtered.slice(page * size, page * size + size),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size, number: page,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/orders/:id`, ({ params }) => {
    const order = mockOrders.find((o) => o.id === params['id']);
    if (!order) return HttpResponse.json({ message: 'الطلب غير موجود' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/orders`, async ({ request }) => {
    const body = await request.json() as Partial<Order>;
    const newOrder: Order = {
      id: `ord-${Date.now()}`, orderNumber: `FL-2026-${String(mockOrders.length + 1).padStart(4, '0')}`,
      customerName: body.customerName ?? '', customerPhone: body.customerPhone ?? '',
      deliveryAddress: body.deliveryAddress ?? { street: '', city: '', governorate: '' },
      items: body.items ?? [], totalAmount: body.totalAmount ?? 0,
      paymentMethod: body.paymentMethod ?? 'COD', status: 'PENDING',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      tenantId: 'tenant-demo',
    };
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.patch(`${BASE}/orders/:id/assign`, async ({ params, request }) => {
    const order = mockOrders.find((o) => o.id === params['id']);
    if (!order) return HttpResponse.json({ message: 'الطلب غير موجود' }, { status: 404 });
    const body = await request.json() as { agentId: string };
    return HttpResponse.json({ ...order, assignedAgentId: body.agentId, status: 'ASSIGNED' });
  }),

  http.patch(`${BASE}/orders/:id/status`, async ({ params, request }) => {
    const order = mockOrders.find((o) => o.id === params['id']);
    if (!order) return HttpResponse.json({ message: 'الطلب غير موجود' }, { status: 404 });
    const body = await request.json() as { status: Order['status']; collectedAmount?: number };
    return HttpResponse.json({ ...order, ...body, updatedAt: new Date().toISOString() });
  }),

  // Agent-specific: orders assigned to logged-in agent
  http.get(`${BASE}/orders/my`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '20');
    const myOrders = mockOrders.filter((o) => o.assignedAgentId === 'agent-1');
    const response: PaginatedResponse<Order> = {
      content: myOrders.slice(page * size, page * size + size),
      totalElements: myOrders.length, totalPages: Math.ceil(myOrders.length / size),
      size, number: page,
    };
    return HttpResponse.json(response);
  }),
];
