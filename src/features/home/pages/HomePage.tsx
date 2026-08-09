'use client';

import { PageLoader, ErrorState } from '@shared/components/feedback';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import { useHomeFeed } from '../hooks/useHomeFeed';
import { FeedSection } from '../components/FeedSection';

export function HomePage() {
  const { t, isReady } = useHomeTranslation();
  const feed = useHomeFeed();

  if (!isReady || feed.isPending) return <PageLoader />;
  if (feed.isError || !feed.data) {
    return <ErrorState onRetry={() => void feed.refetch()} />;
  }

  const { live, endingSoon, upcoming } = feed.data;

  return (
    <div className="flex flex-col gap-8 py-6">
      <FeedSection
        title={t('sections.endingSoon')}
        auctions={endingSoon}
        emptyMessage={t('empty.endingSoon')}
      />
      <FeedSection title={t('sections.live')} auctions={live} emptyMessage={t('empty.live')} />
      <FeedSection
        title={t('sections.upcoming')}
        auctions={upcoming}
        emptyMessage={t('empty.upcoming')}
      />
    </div>
  );
}
