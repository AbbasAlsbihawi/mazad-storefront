'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { recordServerTime } from '@shared/hooks';
import { homeApi } from '../api/home.api';

export function useHomeFeed() {
  const query = useQuery({
    queryKey: QUERY_KEYS.home.feed,
    queryFn: () => homeApi.getFeed(),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (query.data?.serverTime) recordServerTime(query.data.serverTime);
  }, [query.data?.serverTime]);

  return query;
}
