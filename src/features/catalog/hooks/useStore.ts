'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { getErrorStatus } from '@shared/lib';
import { catalogApi } from '../api/catalog.api';

export function useStore(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.store(id),
    queryFn: () => catalogApi.getStore(id),
    enabled: !!id,
    // A missing, suspended or forbidden store won't appear on a second try: show its screen at once.
    // Everything else keeps the app's single retry.
    retry: (failureCount, error) => {
      const status = getErrorStatus(error);
      return status !== 404 && status !== 403 && failureCount < 1;
    },
  });
}
