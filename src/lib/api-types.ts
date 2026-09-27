/**
 * api-types.ts
 *
 * PLACEHOLDER — will be regenerated from openapi.yaml when provided.
 * Run: npx openapi-typescript openapi.yaml -o src/lib/api-types.ts
 *
 * Until openapi.yaml is available, these types represent the expected
 * contract based on the feature requirements. All MSW mocks conform
 * to these same types.
 */

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page index (0-based)
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'WAREHOUSE_MANAGER' | 'DELIVERY_AGENT';

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterTenantRequest {
  companyName: string;
  adminName: string;
  email: string;
  password: string;
  phone: string;
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
export type VehicleType = 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  nationalId?: string;
  zone: string;
  vehicleType: VehicleType;
  vehiclePlate?: string;
  status: AgentStatus;
  avatarUrl?: string;
  createdAt: string; // ISO 8601
  tenantId: string;
}

export interface CreateAgentRequest {
  name: string;
  phone: string;
  nationalId?: string;
  zone: string;
  vehicleType: VehicleType;
  vehiclePlate?: string;
}

export type UpdateAgentRequest = Partial<CreateAgentRequest> & { status?: AgentStatus };

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'PREPAID' | 'BANK_TRANSFER';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number; // EGP
}

export interface OrderAddress {
  street: string;
  city: string;
  governorate: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: OrderAddress;
  items: OrderItem[];
  totalAmount: number; // EGP
  collectedAmount?: number; // EGP – set on delivery
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  tenantId: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  deliveryAddress: OrderAddress;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface AssignOrderRequest {
  agentId: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  collectedAmount?: number;
  failureReason?: string;
  notes?: string;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
  unitPrice: number; // EGP
  imageUrl?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  productId: string;
  quantity: number; // positive = add, negative = remove
  reason: string;
  reference?: string;
}

// ─── Cash Settlement ──────────────────────────────────────────────────────────

export interface AgentSettlement {
  agentId: string;
  agentName: string;
  date: string; // YYYY-MM-DD
  expectedAmount: number;  // EGP – sum of all COD orders assigned
  collectedAmount: number; // EGP – sum actually reported
  difference: number;      // collectedAmount - expectedAmount
  deliveredOrders: number;
  failedOrders: number;
  returnedOrders: number;
  settled: boolean;
  settledAt?: string;
}

export interface SettlementListParams {
  date?: string;
  agentId?: string;
  settled?: boolean;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  cashCollectedToday: number;
  activeOrders: number;
  deliveredToday: number;
  failedToday: number;
  lowStockAlerts: number;
  activeAgents: number;
  pendingSettlements: number;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'ORDER_DELIVERED'
  | 'ORDER_FAILED'
  | 'LOW_STOCK'
  | 'AGENT_ASSIGNED'
  | 'CASH_MISMATCH'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  referenceId?: string; // orderId, productId etc.
  referenceType?: string;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface OrderTrendPoint {
  date: string; // YYYY-MM-DD
  total: number;
  delivered: number;
  failed: number;
}

export interface AgentCashSummary {
  agentName: string;
  collected: number;
  expected: number;
}

export interface OrderStatusBreakdown {
  status: OrderStatus;
  count: number;
}

export interface ReportsSummary {
  orderTrend: OrderTrendPoint[];
  agentCash: AgentCashSummary[];
  statusBreakdown: OrderStatusBreakdown[];
}

// ─── WebSocket events ─────────────────────────────────────────────────────────

export type WsEventType = NotificationType | 'PING' | 'CONNECTED';

export interface WsEvent {
  eventType: WsEventType;
  payload: Notification | Record<string, unknown>;
  timestamp: string;
}
