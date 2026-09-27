import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { agentsHandlers } from './handlers/agents';
import { ordersHandlers } from './handlers/orders';
import {
  inventoryHandlers,
  dashboardHandlers,
  settlementHandlers,
  notificationsHandlers,
  reportsHandlers,
} from './handlers/data';

export const worker = setupWorker(
  ...authHandlers,
  ...agentsHandlers,
  ...ordersHandlers,
  ...inventoryHandlers,
  ...dashboardHandlers,
  ...settlementHandlers,
  ...notificationsHandlers,
  ...reportsHandlers,
);
