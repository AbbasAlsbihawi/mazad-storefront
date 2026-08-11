'use client';

import { useNamespaceTranslation } from '@shared/hooks';
import { NOTIFICATIONS_NAMESPACE, loadNotificationsNamespace } from '../i18n';

export function useNotificationsTranslation() {
  return useNamespaceTranslation(NOTIFICATIONS_NAMESPACE, loadNotificationsNamespace);
}
