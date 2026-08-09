import type { NamespaceBundles } from '@shared/hooks';

export const SELLERS_NAMESPACE = 'sellers';

export async function loadSellersNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
