'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { liveRefetchInterval, useAuctionLiveUpdates } from '@shared/realtime';
import { catalogApi } from '../api/catalog.api';

// `isLive` comes from the caller (bid history itself carries no auction status) — polling only
// makes sense while the auction can still receive new bids. Socket events refetch immediately.
export function useAuctionBids(id: string, isLive: boolean) {
  const queryKey = QUERY_KEYS.catalog.auctionBids(id);
  const realtime = useAuctionLiveUpdates(id, queryKey);
  // The rows mark the viewer's own bids ("You"), so signing in or out fetches them again. Socket
  // events still invalidate by the shorter key above (a prefix of this one).
  const signedIn = useIsAuthenticated();
  return useQuery({
    queryKey: [...queryKey, signedIn ? 'signed-in' : 'guest'],
    queryFn: () => catalogApi.getAuctionBids(id),
    enabled: !!id,
    refetchInterval: isLive ? liveRefetchInterval(realtime) : false,
  });
}
