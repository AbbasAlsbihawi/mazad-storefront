'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { SELLING_NAMESPACE, loadSellingNamespace } from '../i18n';

export function useSellingTranslation() {
  return useNamespaceTranslation(SELLING_NAMESPACE, loadSellingNamespace);
}
