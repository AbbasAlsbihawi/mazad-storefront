'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

export function useSimilarAuctions(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctionSimilar(id),
    queryFn: () => catalogApi.getSimilarAuctions(id),
    enabled: !!id,
  });
}
