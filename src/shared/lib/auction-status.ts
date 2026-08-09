import type { AuctionStatus } from '@shared/types';

export type AuctionStatusTone = 'live' | 'upcoming' | 'warning' | 'neutral';

const ENDING_SOON_MS = 60 * 60 * 1000;

export function getAuctionStatusTone(status: AuctionStatus, endsInMs: number): AuctionStatusTone {
  if (status === 'LIVE') {
    return endsInMs > 0 && endsInMs <= ENDING_SOON_MS ? 'warning' : 'live';
  }
  if (status === 'SCHEDULED') return 'upcoming';
  return 'neutral';
}

/** Key into the `common` namespace's `auctionStatus.*` strings. */
export function getAuctionStatusLabelKey(status: AuctionStatus, endsInMs: number): string {
  const tone = getAuctionStatusTone(status, endsInMs);
  if (tone === 'warning') return 'auctionStatus.endingSoon';
  if (tone === 'live') return 'auctionStatus.live';
  if (tone === 'upcoming') return 'auctionStatus.upcoming';
  return 'auctionStatus.ended';
}
