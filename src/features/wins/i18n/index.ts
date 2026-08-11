import type { NamespaceBundles } from '@shared/hooks';

export const WINS_NAMESPACE = 'wins';

export async function loadWinsNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
