'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { ordersApi } from '../api/orders.api';
import { ORDERS_PAGE_SIZE } from '../lib/paging';
import { isOpenSale } from '../lib/seller-orders';
import type { OrdersList } from '../types/orders.types';

/** Page n+1 while the last page was full; a short (or empty) page is the end of the list. */
function nextPage(lastPage: OrdersList, allPages: OrdersList[]): number | undefined {
  return lastPage.length >= ORDERS_PAGE_SIZE ? allPages.length + 1 : undefined;
}

/** The buyer's orders, newest first, a page at a time ("Load more"). */
export function useOrders(isEnabled = true) {
  const isAuthenticated = useIsAuthenticated();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.orders.list,
    queryFn: ({ pageParam }) => ordersApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: isAuthenticated && isEnabled,
  });
}

/** The seller's received orders (Sales), a page at a time. */
export function useSales(isEnabled = true) {
  const isAuthenticated = useIsAuthenticated();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.orders.sales,
    queryFn: ({ pageParam }) => ordersApi.listSales(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: isAuthenticated && isEnabled,
  });
}

/**
 * Received orders that still need the seller (the Selling hub count), from GET /me/sales/summary.
 * While an older API has no such route (404) or it fails, falls back to counting the first page,
 * which is what the hub showed before. Never pages through every sale to count them.
 */
export function useOpenSalesCount(): number | undefined {
  const isAuthenticated = useIsAuthenticated();
  const summary = useQuery({
    queryKey: QUERY_KEYS.orders.salesSummary,
    queryFn: ordersApi.salesSummary,
    enabled: isAuthenticated,
    retry: false,
  });
  const firstPage = useQuery({
    queryKey: QUERY_KEYS.orders.salesFirstPage,
    queryFn: () => ordersApi.listSales(1),
    enabled: isAuthenticated && summary.isError,
  });

  if (summary.data) return summary.data.open;
  return summary.isError ? firstPage.data?.filter(isOpenSale).length : undefined;
}

export function useOrder(id: string) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id),
    queryFn: () => ordersApi.get(id),
    enabled: isAuthenticated && Boolean(id),
  });
}
