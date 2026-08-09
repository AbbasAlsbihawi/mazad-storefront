'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { ADDRESSES_NAMESPACE, loadAddressesNamespace } from '../i18n';

export function useAddressesTranslation() {
  return useNamespaceTranslation(ADDRESSES_NAMESPACE, loadAddressesNamespace);
}
