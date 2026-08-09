'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

// `isLive` comes from the caller (bid history itself carries no auction status) — polling only
// makes sense while the auction can still receive new bids. See the interactive-features plan.
export function useAuctionBids(id: string, isLive: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctionBids(id),
    queryFn: () => catalogApi.getAuctionBids(id),
    enabled: !!id,
    refetchInterval: isLive ? 5000 : false,
  });
}
