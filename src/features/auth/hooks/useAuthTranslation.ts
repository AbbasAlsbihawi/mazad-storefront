'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { AUTH_NAMESPACE, loadAuthNamespace } from '../i18n';

export function useAuthTranslation() {
  return useNamespaceTranslation(AUTH_NAMESPACE, loadAuthNamespace);
}
