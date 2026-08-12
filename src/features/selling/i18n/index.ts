import type { NamespaceBundles } from '@shared/hooks';

export const SELLING_NAMESPACE = 'selling';

export async function loadSellingNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
