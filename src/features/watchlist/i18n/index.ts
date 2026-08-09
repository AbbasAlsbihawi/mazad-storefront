import type { NamespaceBundles } from '@shared/hooks';

export const WATCHLIST_NAMESPACE = 'watchlist';

export async function loadWatchlistNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
