import type { NamespaceBundles } from '@shared/hooks';

export const ORDERS_NAMESPACE = 'orders';

export async function loadOrdersNamespace(): Promise<NamespaceBundles> {
  const [en, ar] = await Promise.all([
    import('./en.json').then((m) => m.default),
    import('./ar.json').then((m) => m.default),
  ]);
  return { en, ar };
}
