import { httpClient } from '@shared/api';
import { orderSchema, ordersListSchema } from '../schemas/orders.schema';
import type { Order, OrdersList } from '../types/orders.types';

export const ordersApi = {
  list: async (): Promise<OrdersList> => {
    const response = await httpClient.get<unknown>('/me/orders', { params: { limit: 50 } });
    return ordersListSchema.parse(response.data);
  },

  get: async (id: string): Promise<Order> => {
    const response = await httpClient.get<unknown>(`/orders/${id}`);
    return orderSchema.parse(response.data);
  },

  // Only allowed while the order is still CREATED — mazad-api rejects anything later with
  // ORDER_STATUS_INVALID, which the detail screen surfaces by errorCode.
  cancel: async (id: string, reason?: string): Promise<void> => {
    await httpClient.post(`/orders/${id}/cancel`, { reason });
  },

  openReturn: async (orderItemId: string, reason: string): Promise<void> => {
    await httpClient.post(`/order-items/${orderItemId}/return`, { reason });
  },
};
