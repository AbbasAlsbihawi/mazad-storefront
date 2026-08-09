import type { NamespaceBundles } from '@shared/hooks';

export const BIDDING_NAMESPACE = 'bidding';

export async function loadBiddingNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
