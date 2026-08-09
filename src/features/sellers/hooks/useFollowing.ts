'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useIsAuthenticated } from '@shared/hooks';
import { sellersApi } from '../api/sellers.api';

export function useFollowing() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: QUERY_KEYS.sellers.following,
    queryFn: sellersApi.listFollowing,
    enabled: isAuthenticated,
  });
}
