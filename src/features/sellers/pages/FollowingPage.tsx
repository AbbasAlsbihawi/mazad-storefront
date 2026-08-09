'use client';

import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { useFollowing } from '../hooks/useFollowing';
import { useSellersTranslation } from '../hooks/useSellersTranslation';
import { FollowingListRow } from '../components/FollowingListRow';

export function FollowingPage() {
  const { t, isReady } = useSellersTranslation();
  const { data, isPending, isError, refetch } = useFollowing();

  if (!isReady || isPending) return <PageLoader />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">{t('followingPage.title')}</h1>
      {data.data.length === 0 ? (
        <EmptyState message={t('followingPage.empty')} />
      ) : (
        <div className="flex flex-col gap-3">
          {data.data.map((item) => (
            <FollowingListRow key={item.sellerId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
