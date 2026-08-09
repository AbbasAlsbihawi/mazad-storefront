'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

export function useStore(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.store(id),
    queryFn: () => catalogApi.getStore(id),
    enabled: !!id,
  });
}
