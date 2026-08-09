'use client';

import { useSyncExternalStore } from 'react';
import { getSessionTokens, subscribeToSessionTokens } from '@shared/api';

// Reads session state via useSyncExternalStore (not a feature store) so we can give React an
// explicit `false` server snapshot — the store's own "initial state" is already client-tainted by
// the time its module evaluates in the browser, which is what caused an earlier Header hydration
// mismatch. Lives in shared/ (not features/auth/) because every feature needs "am I logged in"
// and features/ must never import from other features/.
export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(
    subscribeToSessionTokens,
    () => !!getSessionTokens(),
    () => false,
  );
}
