import Link from 'next/link';
import { EmptyState } from '@shared/components/feedback';
import { AuctionRail, AuctionRailSkeleton } from '@shared/components/cards';
import { SectionHeader } from '@shared/components/ui';
import type { AuctionSummary } from '@shared/types';

export interface FeedSectionProps {
  title: string;
  auctions: AuctionSummary[];
  emptyMessage: string;
  actionLabel: string;
  actionHref: string;
  isLoading?: boolean;
}

/** One home-feed row: header with a "view all" link, then a snapping rail of auction cards. */
export function FeedSection({
  title,
  auctions,
  emptyMessage,
  actionLabel,
  actionHref,
  isLoading = false,
}: FeedSectionProps) {
  return (
    <section className="flex flex-col">
      <SectionHeader
        title={title}
        action={
          <Link
            href={actionHref}
            className="inline-flex min-h-touch items-center px-1 text-subhead font-semibold text-primary-text"
          >
            {actionLabel}
          </Link>
        }
      />
      {isLoading ? (
        <AuctionRailSkeleton />
      ) : auctions.length === 0 ? (
        <EmptyState message={emptyMessage} icon="gavel" />
      ) : (
        <AuctionRail auctions={auctions} />
      )}
    </section>
  );
}
