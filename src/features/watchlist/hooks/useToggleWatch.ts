'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { watchlistApi } from '../api/watchlist.api';
import { useWatchlistTranslation } from './useWatchlistTranslation';

// Optimism lives in the calling component's own local state (see WatchlistToggle), not here —
// the watchlist list cache holds a different row shape per auction than any caller has on hand
// (a card only has AuctionSummary, the detail page only has Auction), so there's nothing safe to
// splice into QUERY_KEYS.watchlist.list ahead of the real response. This just does the request
// and refreshes that list once the server confirms.
export function useToggleWatch(auctionId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useWatchlistTranslation();

  return useMutation({
    mutationFn: (nextWatching: boolean) =>
      nextWatching ? watchlistApi.watch(auctionId) : watchlistApi.unwatch(auctionId),
    onSuccess: (result) => {
      toast.success(t(result.watching ? 'toast.added' : 'toast.removed'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlist.list });
    },
  });
}
