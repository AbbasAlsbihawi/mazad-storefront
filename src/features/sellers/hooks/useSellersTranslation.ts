'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { SELLERS_NAMESPACE, loadSellersNamespace } from '../i18n';

export function useSellersTranslation() {
  return useNamespaceTranslation(SELLERS_NAMESPACE, loadSellersNamespace);
}
