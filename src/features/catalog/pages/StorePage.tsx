'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { ScreenHeader } from '@shared/components/layout';
import { Card, CardContent, Icon, SectionHeader } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useLocale, useMoney } from '@shared/hooks';
import { pickLocalizedName } from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useStore } from '../hooks/useStore';
import { useStoreAuctions } from '../hooks/useStoreAuctions';
import { AuctionGrid, AuctionGridSkeleton } from '@shared/components/cards';

export interface StorePageProps {
  id: string;
  renderSellerFollowToggle?: (sellerId: string) => ReactNode;
}

export function StorePage({ id, renderSellerFollowToggle }: StorePageProps) {
  const { t, isReady } = useCatalogTranslation();
  const { locale } = useLocale();
  const { money } = useMoney();
  const store = useStore(id);
  const auctions = useStoreAuctions(id);

  if (!isReady || store.isPending) return <PageLoader />;
  if (store.isError || !store.data) {
    return <ErrorState message={t('store.notFound')} onRetry={() => void store.refetch()} />;
  }

  const data = store.data;

  return (
    <>
      <ScreenHeader title={t('store.title')} backHref={ROUTES.auctions} />

      <div className="flex flex-col gap-5 px-gutter pb-6">
        <Card isInset className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <Icon name="store" size={24} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-title-3 font-bold text-foreground">
                {pickLocalizedName(data, locale)}
              </p>
              <p className="truncate text-footnote text-muted-foreground">
                {data.city}
                {data.area ? `, ${data.area}` : ''}
              </p>
            </div>
          </div>

          <CardContent className="flex flex-col gap-2 p-0 text-subhead">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t('store.deliveryFee')}</span>
              <span className="font-medium text-foreground tabular-nums">
                {money(data.deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t('detail.seller')}</span>
              <span className="flex items-center gap-2">
                <Link
                  href={ROUTES.sellerProfile(data.seller.id)}
                  className="font-semibold text-primary-text"
                >
                  {data.seller.fullName}
                </Link>
                {renderSellerFollowToggle?.(data.seller.id)}
              </span>
            </div>
          </CardContent>
        </Card>

        <section>
          <SectionHeader title={t('store.activeAuctions')} />
          {auctions.isPending ? (
            <AuctionGridSkeleton count={4} />
          ) : auctions.isError ? (
            <ErrorState onRetry={() => void auctions.refetch()} />
          ) : auctions.data.data.length === 0 ? (
            <EmptyState icon="gavel" message={t('browse.empty')} />
          ) : (
            <AuctionGrid auctions={auctions.data.data} />
          )}
        </section>
      </div>
    </>
  );
}
