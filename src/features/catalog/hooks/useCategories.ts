'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.categories,
    queryFn: () => catalogApi.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}
