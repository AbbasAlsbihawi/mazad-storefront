'use client';

import { useState } from 'react';
import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useCategories } from '../hooks/useCategories';
import { useAuctions } from '../hooks/useAuctions';
import { CategoryChips } from '../components/CategoryChips';
import { StatusFilter } from '../components/StatusFilter';
import { AuctionGrid } from '@shared/components/cards';
import type { AuctionStatusFilter } from '../types/catalog.types';

export function AuctionsBrowsePage() {
  const { t, isReady } = useCatalogTranslation();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<AuctionStatusFilter | undefined>(undefined);

  const categories = useCategories();
  const auctions = useAuctions({ categoryId, status, limit: 24 });

  if (!isReady) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-bold text-foreground">{t('browse.title')}</h1>

      <div className="flex flex-col gap-3">
        <StatusFilter selected={status} onSelect={setStatus} />
        {categories.data ? (
          <CategoryChips
            categories={categories.data}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        ) : null}
      </div>

      {auctions.isPending ? (
        <PageLoader />
      ) : auctions.isError ? (
        <ErrorState onRetry={() => void auctions.refetch()} />
      ) : auctions.data.data.length === 0 ? (
        <EmptyState message={t('browse.empty')} />
      ) : (
        <AuctionGrid auctions={auctions.data.data} />
      )}
    </div>
  );
}
