'use client';

import { useState } from 'react';
import { PageLoader } from '@shared/components/feedback';
import { Button } from '@shared/components/ui';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { BidHistoryItem } from '../types/catalog.types';
import { BidHistoryList } from './BidHistoryList';
import { DetailSection } from './DetailSection';

/** Rows shown before "Show all". */
const COLLAPSED_BIDS = 10;

export function BidHistorySection({ bids }: { bids: BidHistoryItem[] | undefined }) {
  const { t } = useCatalogTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = (bids?.length ?? 0) > COLLAPSED_BIDS;
  const shown = bids && !isExpanded ? bids.slice(0, COLLAPSED_BIDS) : bids;

  return (
    <DetailSection title={t('detail.bidHistory')} testId="detail-bids">
      {shown ? <BidHistoryList bids={shown} /> : <PageLoader />}
      {hasMore && bids ? (
        <Button
          variant="plain"
          size="sm"
          className="self-start"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? t('detail.showFewerBids') : t('detail.showAllBids', { count: bids.length })}
        </Button>
      ) : null}
    </DetailSection>
  );
}
