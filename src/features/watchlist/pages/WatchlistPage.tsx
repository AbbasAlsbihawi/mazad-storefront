'use client';

import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchlistTranslation } from '../hooks/useWatchlistTranslation';
import { WatchlistItemRow } from '../components/WatchlistItemRow';

export function WatchlistPage() {
  const { t, isReady } = useWatchlistTranslation();
  const { data, isPending, isError, refetch } = useWatchlist();

  if (!isReady || isPending) return <PageLoader />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">{t('page.title')}</h1>
      {data.data.length === 0 ? (
        <EmptyState message={t('page.empty')} />
      ) : (
        <div className="flex flex-col gap-3">
          {data.data.map((item) => (
            <WatchlistItemRow key={item.auctionId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
