import type { SellerAuction, SellerAuctionStatus } from '../types/selling.types';

/**
 * What a seller may do to their own auction, mirrored from mazad-api's AuctionsService and
 * AuctionStateMachineService. Duplicated deliberately: the API is the authority and will reject
 * anything wrong, but a seller should not be offered a button that is going to 409.
 */

/** `PATCH /auctions/:id` → AUCTION_NOT_EDITABLE outside these two. */
export function canEditAuction(status: SellerAuctionStatus): boolean {
  return status === 'DRAFT' || status === 'REJECTED';
}

/** Submitting is how a draft — or a rejected auction, once fixed — re-enters the approval queue. */
export function canSubmitAuction(status: SellerAuctionStatus): boolean {
  return status === 'DRAFT' || status === 'REJECTED';
}

/**
 * `canSellerCancel`: free before anyone has committed money, and while live only if nobody has
 * bid yet. Pulling a lot out from under existing bidders is an admin-only force-cancel.
 */
export function canCancelAuction(auction: Pick<SellerAuction, 'status' | 'bidCount'>): boolean {
  if (
    auction.status === 'DRAFT' ||
    auction.status === 'SCHEDULED' ||
    auction.status === 'REJECTED'
  ) {
    return true;
  }
  if (auction.status === 'LIVE') return auction.bidCount === 0;
  return false;
}

/** Statuses where the auction is done and nothing further can be done to it. */
export function isAuctionSettled(status: SellerAuctionStatus): boolean {
  return status === 'SOLD' || status === 'UNSOLD' || status === 'CANCELLED' || status === 'ENDED';
}

/** Maps an auction status onto the Badge tones the rest of the app already uses. */
export function getSellerAuctionTone(
  status: SellerAuctionStatus,
): 'live' | 'upcoming' | 'warning' | 'neutral' {
  switch (status) {
    case 'LIVE':
      return 'live';
    case 'SCHEDULED':
    case 'PENDING_APPROVAL':
      return 'upcoming';
    case 'REJECTED':
      return 'warning';
    default:
      return 'neutral';
  }
}
