'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { WATCHLIST_NAMESPACE, loadWatchlistNamespace } from '../i18n';

export function useWatchlistTranslation() {
  return useNamespaceTranslation(WATCHLIST_NAMESPACE, loadWatchlistNamespace);
}
