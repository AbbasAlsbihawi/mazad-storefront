'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { watchlistApi } from '../api/watchlist.api';

export function useWatchlist() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.watchlist.list,
    queryFn: watchlistApi.list,
    enabled: isAuthenticated,
  });
}
