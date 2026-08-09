import { EmptyState } from '@shared/components/feedback';
import { AuctionGrid } from '@shared/components/cards';
import type { AuctionSummary } from '@shared/types';

export interface FeedSectionProps {
  title: string;
  auctions: AuctionSummary[];
  emptyMessage: string;
}

export function FeedSection({ title, auctions, emptyMessage }: FeedSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {auctions.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <AuctionGrid auctions={auctions} />
      )}
    </section>
  );
}
