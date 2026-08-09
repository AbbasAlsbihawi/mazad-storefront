'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { HOME_NAMESPACE, loadHomeNamespace } from '../i18n';

export function useHomeTranslation() {
  return useNamespaceTranslation(HOME_NAMESPACE, loadHomeNamespace);
}
