export type AuctionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'LIVE'
  | 'ENDED'
  | 'SOLD'
  | 'UNSOLD'
  | 'CANCELLED';

/**
 * The shape both /homepage and /auctions return for each auction. Kept here (not in
 * features/catalog) because shared/components/cards/AuctionCard renders it for both the
 * `home` and `catalog` features.
 */
export interface AuctionSummary {
  id: string;
  status: AuctionStatus;
  startingPrice: string;
  currentPrice: string | null;
  bidCount: number;
  startsAt: string;
  endsAt: string;
  product: {
    id: string;
    nameEn: string;
    nameAr: string;
    coverImage: string | null;
  };
}
