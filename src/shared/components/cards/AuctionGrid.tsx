import { AuctionCard } from './AuctionCard';
import type { AuctionSummary } from '@shared/types';

export function AuctionGrid({ auctions }: { auctions: AuctionSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
