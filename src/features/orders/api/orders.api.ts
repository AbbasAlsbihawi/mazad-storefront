import { httpClient } from '@shared/api';
import { ORDERS_PAGE_SIZE } from '../lib/paging';
import { orderSchema, ordersListSchema, salesSummarySchema } from '../schemas/orders.schema';
import type { Order, OrderStatus, OrdersList, SalesSummary } from '../types/orders.types';

export type SellerReturnAction = 'approve' | 'reject' | 'received' | 'refund';

export const ordersApi = {
  list: async (page = 1): Promise<OrdersList> => {
    const response = await httpClient.get<unknown>('/me/orders', {
      params: { page, limit: ORDERS_PAGE_SIZE },
    });
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

  /** The seller's received orders across their stores, newest first (same bare-array shape). */
  listSales: async (page = 1): Promise<OrdersList> => {
    const response = await httpClient.get<unknown>('/me/sales', {
      params: { page, limit: ORDERS_PAGE_SIZE },
    });
    return ordersListSchema.parse(response.data);
  },

  /** The seller's received orders counted by status; `open` still needs the seller. */
  salesSummary: async (): Promise<SalesSummary> => {
    const response = await httpClient.get<unknown>('/me/sales/summary');
    return salesSummarySchema.parse(response.data);
  },

  /**
   * Seller: CREATED → CONFIRMED → OUT_FOR_DELIVERY → DELIVERED (mazad-api SELLER_TRANSITIONS).
   * Delivering an unpaid cash-on-delivery order needs `cashReceived`, the exact total the seller
   * confirmed (CASH_CONFIRMATION_REQUIRED / CASH_AMOUNT_MISMATCH otherwise).
   */
  updateStatus: async (id: string, status: OrderStatus, cashReceived?: number): Promise<void> => {
    await httpClient.post(
      `/orders/${id}/status`,
      cashReceived != null ? { status, cashReceived } : { status },
    );
  },

  /** Seller side of a return: approve, reject (reason required), product received, refund. */
  returnAction: async (
    returnId: string,
    action: SellerReturnAction,
    reason?: string,
  ): Promise<void> => {
    await httpClient.post(
      `/returns/${returnId}/${action}`,
      action === 'reject' ? { reason } : undefined,
    );
  },
};
