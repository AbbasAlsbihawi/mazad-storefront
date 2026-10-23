'use client';

import { useQuery } from '@tanstack/react-query';
import { probeApiFeature, type ApiFeature } from '@shared/api/feature-probe';

/**
 * Whether the deployed API has a feature the design depends on. `undefined` while the probe is
 * in flight: callers render nothing for that entry point until it answers, so a missing feature
 * never flashes in and out. The answer is kept for the session.
 */
export function useApiFeature(feature: ApiFeature): boolean | undefined {
  const query = useQuery({
    queryKey: ['api-feature', feature],
    queryFn: () => probeApiFeature(feature),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
  return query.data;
}
