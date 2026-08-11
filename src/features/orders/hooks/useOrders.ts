'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { ordersApi } from '../api/orders.api';

export function useOrders() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.orders.list,
    queryFn: ordersApi.list,
    enabled: isAuthenticated,
  });
}

export function useOrder(id: string) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id),
    queryFn: () => ordersApi.get(id),
    enabled: isAuthenticated && Boolean(id),
  });
}
