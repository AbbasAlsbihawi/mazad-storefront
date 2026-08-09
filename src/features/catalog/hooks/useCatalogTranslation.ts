'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { CATALOG_NAMESPACE, loadCatalogNamespace } from '../i18n';

export function useCatalogTranslation() {
  return useNamespaceTranslation(CATALOG_NAMESPACE, loadCatalogNamespace);
}
