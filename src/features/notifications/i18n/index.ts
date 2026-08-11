import type { NamespaceBundles } from '@shared/hooks';

export const NOTIFICATIONS_NAMESPACE = 'notifications';

export async function loadNotificationsNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
