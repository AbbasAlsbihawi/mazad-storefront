import { ROUTES } from '@shared/constants';
import { pickLocalizedName, resolveAssetUrl } from '@shared/lib';
import type { Locale } from '@shared/store';
import type { Order } from '../types/orders.types';

type OrderItem = Order['items'][number];
type OrderPayment = NonNullable<Order['payments']>[number];

/** Localized, falling back to the other language; null when neither is there. */
function localized(
  names: { nameEn?: string | null; nameAr?: string | null } | null | undefined,
  locale: Locale,
): string | null {
  if (!names?.nameEn && !names?.nameAr) return null;
  return pickLocalizedName({ nameEn: names.nameEn ?? '', nameAr: names.nameAr ?? '' }, locale);
}

/**
 * The item's name as it was bought (the order's snapshot); an older API without `display` gets
 * the product's current name.
 */
export function orderItemName(item: OrderItem, locale: Locale): string {
  return localized(item.display, locale) ?? localized(item.product, locale) ?? '—';
}

/** The item's photo: the small one for lists, the full one for the order page; null if none. */
export function orderItemImage(item: OrderItem, size: 'thumb' | 'full'): string | null {
  const display = item.display;
  return resolveAssetUrl(
    size === 'thumb'
      ? (display?.thumbUrl ?? display?.imageUrl)
      : (display?.imageUrl ?? display?.thumbUrl),
  );
}

/** The auction page, only while it can still be opened (not withdrawn, blocked or deleted). */
export function orderItemListingHref(item: OrderItem): string | null {
  const auctionId = item.display?.auctionId;
  return item.display?.listingAvailable && auctionId ? ROUTES.auctionDetail(auctionId) : null;
}

/** The store's name when the order was created, else (older API) its name now. */
export function orderStoreName(order: Order, locale: Locale): string {
  return localized(order.storeName, locale) ?? pickLocalizedName(order.store, locale);
}

/** The payment that describes the order: the one that paid it, else the latest still open. */
export function orderPayment(order: Order): OrderPayment | null {
  const payments = order.payments ?? [];
  return (
    payments.find((payment) => payment.paidAt != null || payment.status === 'PAID') ??
    payments.find((payment) => payment.status !== 'CANCELLED') ??
    null
  );
}
