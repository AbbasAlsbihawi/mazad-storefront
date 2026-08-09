'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { BIDDING_NAMESPACE, loadBiddingNamespace } from '../i18n';

export function useBiddingTranslation() {
  return useNamespaceTranslation(BIDDING_NAMESPACE, loadBiddingNamespace);
}
