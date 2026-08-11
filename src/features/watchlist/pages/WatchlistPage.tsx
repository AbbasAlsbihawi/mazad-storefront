'use client';

import { ErrorState, EmptyState, PageLoader } from '@shared/components/feedback';
import { ScreenHeader } from '@shared/components/layout';
import { AuctionGrid, AuctionGridSkeleton } from '@shared/components/cards';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchlistTranslation } from '../hooks/useWatchlistTranslation';

export function WatchlistPage() {
  const { t, isReady } = useWatchlistTranslation();
  const { data, isPending, isError, refetch } = useWatchlist();

  if (!isReady) return <PageLoader />;

  return (
    <>
      <ScreenHeader title={t('page.title')} isRoot />

      <div className="px-gutter pb-6">
        {isPending ? (
          <AuctionGridSkeleton count={4} />
        ) : isError || !data ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : data.data.length === 0 ? (
          <EmptyState icon="heart" title={t('page.emptyTitle')} message={t('page.empty')} />
        ) : (
          // The same card as everywhere else, so the heart that removes an item is the same
          // control that added it.
          <AuctionGrid auctions={data.data.map((item) => item.auction)} />
        )}
      </div>
    </>
  );
}
