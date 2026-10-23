import { getErrorStatus } from '@shared/lib/error.utils';
import { httpClient } from './http-client';

/**
 * Bidoom screens that need API additions (store list, store ratings, support reports) must stay
 * hidden until the deployed API has them, never faked. A probe asks the API once: a route that
 * does not exist answers 404, while one that exists answers 2xx, or 401/403 when it needs a
 * session the visitor doesn't have.
 */
export const API_FEATURE_PROBES = {
  /** GET /stores (the public "Verified stores" rail and stores index). */
  stores: '/stores?limit=1',
  /** GET /me/support/reports (the contact screen's report form and history). */
  supportReports: '/me/support/reports',
} as const;

export type ApiFeature = keyof typeof API_FEATURE_PROBES;

/** True when the API serves the route, false when it answers 404 (or can't be reached). */
export async function probeApiFeature(feature: ApiFeature): Promise<boolean> {
  try {
    await httpClient.get(API_FEATURE_PROBES[feature]);
    return true;
  } catch (error) {
    const status = getErrorStatus(error);
    return status === 401 || status === 403;
  }
}

/** For a feature's own queries: a 404 means "this API doesn't have it yet", not an error to show. */
export function isMissingEndpoint(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}
