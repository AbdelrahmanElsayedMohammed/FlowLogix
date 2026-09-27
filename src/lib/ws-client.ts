/**
 * ws-client.ts
 *
 * STOMP WebSocket client with:
 * - Single connection per app lifecycle
 * - Auto-reconnect with exponential backoff
 * - Auth token attached at connect time
 * - Subscription management
 */
import { Client, type StompSubscription, type IMessage } from '@stomp/stompjs';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';
import type { WsEvent } from './api-types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';

class WebSocketClient {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectDelay = 1000; // ms
  private maxReconnectDelay = 30_000;

  connect(): void {
    if (this.client?.active) return;

    const { accessToken, tenantId } = useAuthStore.getState();

    this.client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${accessToken ?? ''}`,
        'X-Tenant-ID': tenantId ?? '',
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,

      onConnect: () => {
        console.info('[WS] Connected');
        this.reconnectDelay = 1000; // reset backoff
        useNotificationsStore.getState().setConnected(true);
        this.subscribeToTopics();
      },

      onDisconnect: () => {
        console.info('[WS] Disconnected');
        useNotificationsStore.getState().setConnected(false);
      },

      onStompError: (frame) => {
        console.error('[WS] STOMP error', frame);
        useNotificationsStore.getState().setConnected(false);
        // Exponential backoff
        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          this.maxReconnectDelay,
        );
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
    this.client = null;
  }

  private subscribeToTopics(): void {
    if (!this.client?.active) return;
    const { tenantId } = useAuthStore.getState();

    // User-specific notifications
    const sub = this.client.subscribe(
      `/topic/tenant/${tenantId ?? 'default'}/notifications`,
      (msg: IMessage) => this.handleMessage(msg),
    );
    this.subscriptions.set('notifications', sub);
  }

  private handleMessage(msg: IMessage): void {
    try {
      const event = JSON.parse(msg.body) as WsEvent;
      if (event.eventType === 'PING') return;

      const notification = event.payload as Parameters<
        typeof useNotificationsStore.getState extends () => infer R
          ? R extends { addNotification: (...args: infer A) => void }
            ? (...args: A) => void
            : never
          : never
      >[0];

      // Push into Zustand store — the hook useNotifications reads from there
      useNotificationsStore.getState().addNotification(notification as Parameters<typeof useNotificationsStore.getState extends () => infer R
        ? R extends { addNotification: infer F } ? F : never : never>[0]);
    } catch {
      console.error('[WS] Failed to parse message', msg.body);
    }
  }
}

export const wsClient = new WebSocketClient();
