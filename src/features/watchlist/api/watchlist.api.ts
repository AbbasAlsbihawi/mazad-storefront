import { httpClient } from '@shared/api';
import { watchToggleSchema, watchlistListSchema } from '../schemas/watchlist.schema';
import type { WatchToggleResult, WatchlistList } from '../types/watchlist.types';

// No per-auction "is this watched" lookup exists on mazad-api — callers scan this generously
// limited list instead (see WatchlistToggle). Fine for realistic watchlist sizes; a documented
// v1 limitation beyond that, per the interactive-features plan.
const WATCHLIST_SCAN_LIMIT = 100;

export const watchlistApi = {
  watch: async (auctionId: string): Promise<WatchToggleResult> => {
    const response = await httpClient.post<unknown>(`/auctions/${auctionId}/watch`);
    return watchToggleSchema.parse(response.data);
  },

  unwatch: async (auctionId: string): Promise<WatchToggleResult> => {
    const response = await httpClient.delete<unknown>(`/auctions/${auctionId}/watch`);
    return watchToggleSchema.parse(response.data);
  },

  list: async (): Promise<WatchlistList> => {
    const response = await httpClient.get<unknown>('/me/watchlist', {
      params: { limit: WATCHLIST_SCAN_LIMIT },
    });
    return watchlistListSchema.parse(response.data);
  },
};
