'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';
import type { AuctionListParams } from '../types/catalog.types';

export function useAuctions(params: AuctionListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctions(params),
    queryFn: () => catalogApi.listAuctions(params),
    placeholderData: keepPreviousData,
  });
}
