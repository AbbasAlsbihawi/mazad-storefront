import type { NamespaceBundles } from '@shared/hooks';

export const HOME_NAMESPACE = 'home';

export async function loadHomeNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
