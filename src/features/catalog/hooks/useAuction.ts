'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

export function useAuction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auction(id),
    queryFn: () => catalogApi.getAuction(id),
    enabled: !!id,
    // Polling, not a socket (see the interactive-features plan) — only while the auction can
    // still change (LIVE), so an ended/sold auction's detail page stops refetching for nothing.
    refetchInterval: (query) => (query.state.data?.status === 'LIVE' ? 5000 : false),
  });
}
