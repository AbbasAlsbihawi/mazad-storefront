import type { NamespaceBundles } from '@shared/hooks';

export const ADDRESSES_NAMESPACE = 'addresses';

export async function loadAddressesNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
