'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { biddingApi } from '../api/bidding.api';
import type { MyBidsParams } from '../types/bidding.types';

export function useMyBids(params: MyBidsParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.bidding.myBids(params),
    queryFn: () => biddingApi.listMyBids(params),
  });
}
