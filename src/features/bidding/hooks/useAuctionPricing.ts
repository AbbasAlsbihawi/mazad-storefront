'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { biddingApi } from '../api/bidding.api';

export function useAuctionPricing(auctionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.bidding.auctionPricing(auctionId),
    queryFn: () => biddingApi.getAuctionPricing(auctionId),
    enabled: !!auctionId,
    // Polling, not a socket — see the interactive-features plan's realtime decision. Only ticks
    // while the auction is actually live; a closed/ended auction's pricing won't change.
    refetchInterval: (query) => (query.state.data?.status === 'LIVE' ? 5000 : false),
  });
}
