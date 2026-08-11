'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { WINS_NAMESPACE, loadWinsNamespace } from '../i18n';

export function useWinsTranslation() {
  return useNamespaceTranslation(WINS_NAMESPACE, loadWinsNamespace);
}
