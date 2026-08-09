import type { NamespaceBundles } from '@shared/hooks';

export const AUTH_NAMESPACE = 'auth';

export async function loadAuthNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
