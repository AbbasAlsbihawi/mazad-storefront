'use client';

import { orderPayment } from '../lib/order-display';
import type { Order } from '../types/orders.types';
import { useOrdersTranslation } from './useOrdersTranslation';

/**
 * "Cash on delivery" or "Card", and where that payment stands, from the order's own payment
 * records (the paid one, else the latest open one). Null when the API sent none.
 */
export function useOrderPaymentLabel(order: Order): { method: string; status: string } | null {
  const { t } = useOrdersTranslation();
  const payment = orderPayment(order);
  if (!payment) return null;
  return {
    method: t(`payment.methodName.${payment.method}`),
    // Cash on delivery is pending until the seller collects it: "not paid yet", not "waiting".
    status:
      payment.status === 'PENDING' && payment.method === 'CASH_ON_DELIVERY'
        ? t('payment.notPaidYet')
        : t(`payment.status.${payment.status}`),
  };
}
