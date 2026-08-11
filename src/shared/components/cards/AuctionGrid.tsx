import { cn } from '@shared/lib';
import { AuctionCardSkeleton } from '@shared/components/ui';
import { AuctionCard } from './AuctionCard';
import type { AuctionSummary } from '@shared/types';

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
} as const;

export interface AuctionGridProps {
  auctions: AuctionSummary[];
  /** 2-up is the phone default; the wider layouts are for tablet-width routes. */
  columns?: keyof typeof COLUMN_CLASSES;
  className?: string;
}

export function AuctionGrid({ auctions, columns = 2, className }: AuctionGridProps) {
  return (
    <div className={cn('grid items-stretch gap-3', COLUMN_CLASSES[columns], className)}>
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}

/** Matches AuctionGrid's footprint so the real cards don't shift in when the query resolves. */
export function AuctionGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-3">
      {Array.from({ length: count }, (_, index) => (
        <AuctionCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * AuctionRail — the horizontally scrolling row that carries each home-feed section. Snaps so a
 * flick always lands on a card edge rather than mid-card.
 */
export function AuctionRail({ auctions }: { auctions: AuctionSummary[] }) {
  return (
    <div className="no-scrollbar -mx-gutter flex snap-x snap-mandatory gap-3 overflow-x-auto px-gutter pb-1">
      {auctions.map((auction) => (
        <div key={auction.id} className="w-42 shrink-0 snap-start">
          <AuctionCard auction={auction} />
        </div>
      ))}
    </div>
  );
}

export function AuctionRailSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter pb-1">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-42 shrink-0">
          <AuctionCardSkeleton />
        </div>
      ))}
    </div>
  );
}
