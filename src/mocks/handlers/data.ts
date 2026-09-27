// MOCK – wire to real API once openapi.yaml is provided
import { http, HttpResponse } from 'msw';
import type { Product, PaginatedResponse, DashboardSummary, AgentSettlement, Notification, ReportsSummary } from '@/lib/api-types';

const BASE = '*/api/v1';

// ─── Products ─────────────────────────────────────────────────────────────────
const mockProducts: Product[] = [
  { id: 'prod-1', sku: 'DELL-001', name: 'لاب توب ديل إنسبايرون', category: 'إلكترونيات', unit: 'قطعة', currentStock: 8, lowStockThreshold: 5, unitPrice: 25000, tenantId: 'tenant-demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
  { id: 'prod-2', sku: 'SAM-TAB-001', name: 'تابلت سامسونج جالاكسي', category: 'إلكترونيات', unit: 'قطعة', currentStock: 3, lowStockThreshold: 5, unitPrice: 8500, tenantId: 'tenant-demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
  { id: 'prod-3', sku: 'APL-IP15', name: 'هاتف آيفون 15 برو', category: 'إلكترونيات', unit: 'قطعة', currentStock: 15, lowStockThreshold: 5, unitPrice: 35000, tenantId: 'tenant-demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
  { id: 'prod-4', sku: 'LG-MON-27', name: 'شاشة LG 27 بوصة 4K', category: 'إلكترونيات', unit: 'قطعة', currentStock: 2, lowStockThreshold: 3, unitPrice: 12000, tenantId: 'tenant-demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
  { id: 'prod-5', sku: 'PKG-BUBBLE', name: 'فقاعات تغليف', category: 'مواد تعبئة', unit: 'رول', currentStock: 50, lowStockThreshold: 10, unitPrice: 120, tenantId: 'tenant-demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
];

export const inventoryHandlers = [
  http.get(`${BASE}/inventory/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '10');
    const response: PaginatedResponse<Product> = {
      content: mockProducts.slice(page * size, page * size + size),
      totalElements: mockProducts.length,
      totalPages: Math.ceil(mockProducts.length / size),
      size, number: page,
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/inventory/products/:id/adjust`, async ({ params, request }) => {
    const product = mockProducts.find((p) => p.id === params['id']);
    if (!product) return HttpResponse.json({ message: 'المنتج غير موجود' }, { status: 404 });
    const body = await request.json() as { quantity: number; reason: string };
    return HttpResponse.json({ ...product, currentStock: product.currentStock + body.quantity });
  }),
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardHandlers = [
  http.get(`${BASE}/dashboard/summary`, () => {
    const summary: DashboardSummary = {
      cashCollectedToday: 72500,
      activeOrders: 18,
      deliveredToday: 12,
      failedToday: 2,
      lowStockAlerts: 2,
      activeAgents: 3,
      pendingSettlements: 1,
    };
    return HttpResponse.json(summary);
  }),
];

// ─── Cash Settlement ──────────────────────────────────────────────────────────
const mockSettlements: AgentSettlement[] = [
  { agentId: 'agent-1', agentName: 'محمد علي', date: '2026-07-28', expectedAmount: 37500, collectedAmount: 37500, difference: 0, deliveredOrders: 3, failedOrders: 1, returnedOrders: 0, settled: false },
  { agentId: 'agent-2', agentName: 'أحمد حسن', date: '2026-07-28', expectedAmount: 35000, collectedAmount: 35000, difference: 0, deliveredOrders: 1, failedOrders: 0, returnedOrders: 0, settled: true, settledAt: '2026-07-28T17:00:00Z' },
  { agentId: 'agent-4', agentName: 'سامر يوسف', date: '2026-07-28', expectedAmount: 12000, collectedAmount: 10500, difference: -1500, deliveredOrders: 2, failedOrders: 0, returnedOrders: 1, settled: false },
];

export const settlementHandlers = [
  http.get(`${BASE}/settlements`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const filtered = date ? mockSettlements.filter((s) => s.date === date) : mockSettlements;
    return HttpResponse.json(filtered);
  }),

  http.post(`${BASE}/settlements/:agentId/settle`, ({ params }) => {
    const s = mockSettlements.find((s) => s.agentId === params['agentId']);
    if (!s) return HttpResponse.json({ message: 'لا توجد تسوية' }, { status: 404 });
    return HttpResponse.json({ ...s, settled: true, settledAt: new Date().toISOString() });
  }),
];

// ─── Notifications ────────────────────────────────────────────────────────────
const mockNotifications: Notification[] = [
  { id: 'notif-1', type: 'ORDER_DELIVERED', title: 'تم التسليم', message: 'تم تسليم الطلب FL-2026-0003 بنجاح', read: false, createdAt: '2026-07-28T16:00:00Z', referenceId: 'ord-3', referenceType: 'ORDER' },
  { id: 'notif-2', type: 'LOW_STOCK', title: 'تنبيه مخزون', message: 'مخزون تابلت سامسونج منخفض (3 قطع)', read: false, createdAt: '2026-07-28T15:00:00Z', referenceId: 'prod-2', referenceType: 'PRODUCT' },
  { id: 'notif-3', type: 'CASH_MISMATCH', title: 'فارق في التسوية', message: 'يوجد فارق 1500 ج.م في حساب سامر يوسف', read: true, createdAt: '2026-07-28T14:00:00Z', referenceId: 'agent-4', referenceType: 'AGENT' },
  { id: 'notif-4', type: 'ORDER_FAILED', title: 'فشل التسليم', message: 'فشل تسليم الطلب FL-2026-0005 — العميل لم يرد', read: true, createdAt: '2026-07-27T15:00:00Z', referenceId: 'ord-5', referenceType: 'ORDER' },
];

export const notificationsHandlers = [
  http.get(`${BASE}/notifications`, () => HttpResponse.json(mockNotifications)),
  http.patch(`${BASE}/notifications/:id/read`, ({ params }) => {
    const n = mockNotifications.find((n) => n.id === params['id']);
    if (!n) return HttpResponse.json({ message: 'الإشعار غير موجود' }, { status: 404 });
    return HttpResponse.json({ ...n, read: true });
  }),
  http.post(`${BASE}/notifications/read-all`, () => HttpResponse.json({ message: 'تم تحديد الكل كمقروء' })),
];

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportsHandlers = [
  http.get(`${BASE}/reports/summary`, () => {
    const data: ReportsSummary = {
      orderTrend: Array.from({ length: 14 }, (_, i) => {
        const d = new Date('2026-07-15');
        d.setDate(d.getDate() + i);
        const total = 5 + Math.floor(Math.random() * 15);
        const delivered = Math.floor(total * 0.75);
        return { date: d.toISOString().split('T')[0] ?? '', total, delivered, failed: total - delivered };
      }),
      agentCash: [
        { agentName: 'محمد علي', collected: 37500, expected: 37500 },
        { agentName: 'أحمد حسن', collected: 35000, expected: 35000 },
        { agentName: 'سامر يوسف', collected: 10500, expected: 12000 },
        { agentName: 'خالد إبراهيم', collected: 0, expected: 0 },
      ],
      statusBreakdown: [
        { status: 'DELIVERED', count: 42 },
        { status: 'PENDING', count: 8 },
        { status: 'IN_TRANSIT', count: 10 },
        { status: 'FAILED', count: 5 },
        { status: 'RETURNED', count: 3 },
        { status: 'CANCELLED', count: 2 },
      ],
    };
    return HttpResponse.json(data);
  }),
];
