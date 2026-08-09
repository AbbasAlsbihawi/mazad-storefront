import { parseMoney } from '@shared/lib';

export interface MinimumBidInput {
  currentPrice: string | null;
  startingPrice: string;
  minIncrement: string;
}

/** Mirrors mazad-api's own minimum-bid formula so the client can validate before submitting. */
export function computeMinimumBid({
  currentPrice,
  startingPrice,
  minIncrement,
}: MinimumBidInput): number | null {
  const base = parseMoney(currentPrice) ?? parseMoney(startingPrice);
  const increment = parseMoney(minIncrement);
  if (base == null || increment == null) return null;
  return base + increment;
}
