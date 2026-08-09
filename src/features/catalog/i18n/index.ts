import type { NamespaceBundles } from '@shared/hooks';

export const CATALOG_NAMESPACE = 'catalog';

export async function loadCatalogNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
