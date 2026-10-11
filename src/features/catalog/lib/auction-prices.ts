import { fromMinorUnits, toMinorUnits } from '@shared/lib';
import type { Auction } from '../types/catalog.types';

/** What the big price is: the leading bid, the opening bid (no bids yet), or the sale price. */
export type MainPriceKind = 'current' | 'opening' | 'sold';

/**
 * Every price the auction page shows, each a separate amount that is never relabelled as another.
 * A row is null when there is nothing to show; amounts stay Decimal strings for `money()`.
 */
export interface AuctionPrices {
  main: { kind: MainPriceKind; amount: string };
  /** The opening bid as its own row, once bids have replaced it as the main price. */
  opening: string | null;
  /** Buy now while it can still be used, with the final total including delivery. */
  buyNow: { amount: string; totalWithDelivery: string; saving: string | null } | null;
  /** The seller's new retail price (optional, not verified by Mazad). */
  marketPrice: string | null;
  /** How much the next bid raises the price (live auctions only). */
  nextRaise: string | null;
  deliveryFee: string;
  isDeliveryFree: boolean;
  /** How far the main price is below the new retail price; null unless it is below. */
  saving: string | null;
}

/** `market - price` when the new retail price is higher, else null. */
function savingBelow(market: number | null, price: number | null): string | null {
  if (market == null || price == null || market <= price) return null;
  return String(fromMinorUnits(market - price));
}

export function auctionPrices(auction: Auction): AuctionPrices {
  const isLive = auction.status === 'LIVE';
  const current = toMinorUnits(auction.currentPrice);
  const buyNow = toMinorUnits(auction.buyNowPrice);
  const market = toMinorUnits(auction.product.marketPrice);
  const deliveryFee = auction.deliveryFee ?? auction.store.deliveryFee;
  const delivery = toMinorUnits(deliveryFee) ?? 0;

  const mainKind: MainPriceKind =
    auction.currentPrice == null ? 'opening' : auction.status === 'SOLD' ? 'sold' : 'current';
  const mainAmount = auction.currentPrice ?? auction.startingPrice;
  // Buy now ends once the bidding reaches it, and with the auction.
  const buyNowOpen = isLive && buyNow != null && (current == null || current < buyNow);

  return {
    main: { kind: mainKind, amount: mainAmount },
    opening: auction.currentPrice != null ? auction.startingPrice : null,
    buyNow:
      buyNowOpen && auction.buyNowPrice
        ? {
            amount: auction.buyNowPrice,
            totalWithDelivery: String(fromMinorUnits(buyNow + delivery)),
            saving: savingBelow(market, buyNow),
          }
        : null,
    marketPrice: market != null && market > 0 ? auction.product.marketPrice : null,
    nextRaise: isLive ? (auction.bidIncrement ?? auction.minIncrement) : null,
    deliveryFee,
    isDeliveryFree: delivery === 0,
    saving: savingBelow(market, toMinorUnits(mainAmount)),
  };
}
