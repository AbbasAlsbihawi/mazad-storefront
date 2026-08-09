'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { sellersApi } from '../api/sellers.api';

export function useSellerProfile(sellerId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.sellers.profile(sellerId),
    queryFn: () => sellersApi.getProfile(sellerId),
    enabled: !!sellerId,
  });
}
