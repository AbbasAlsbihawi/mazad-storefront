'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { ORDERS_NAMESPACE, loadOrdersNamespace } from '../i18n';

export function useOrdersTranslation() {
  return useNamespaceTranslation(ORDERS_NAMESPACE, loadOrdersNamespace);
}
