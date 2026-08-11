'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { ordersApi } from '../api/orders.api';
import { useOrdersTranslation } from './useOrdersTranslation';

export function useCancelOrder(orderId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useOrdersTranslation();

  return useMutation({
    mutationFn: (reason?: string) => ordersApi.cancel(orderId, reason),
    onSuccess: () => {
      toast.success(t('toast.cancelled'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list });
    },
  });
}

export function useOpenReturn(orderId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useOrdersTranslation();

  return useMutation({
    mutationFn: ({ orderItemId, reason }: { orderItemId: string; reason: string }) =>
      ordersApi.openReturn(orderItemId, reason),
    onSuccess: () => {
      toast.success(t('toast.returnOpened'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list });
    },
  });
}
