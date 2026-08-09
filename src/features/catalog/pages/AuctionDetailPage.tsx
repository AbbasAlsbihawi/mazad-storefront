'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from 'node_modules/react-i18next';
import { ROUTES } from '@shared/constants';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { Badge, Card, CardContent } from '@shared/components/ui';
import { useLocale, useServerClock } from '@shared/hooks';
import {
  formatMoney,
  pickLocalizedName,
  getAuctionStatusTone,
  getAuctionStatusLabelKey,
} from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useAuction } from '../hooks/useAuction';
import { useAuctionBids } from '../hooks/useAuctionBids';
import { useSimilarAuctions } from '../hooks/useSimilarAuctions';
import { Countdown } from '../components/Countdown';
import { BidHistoryList } from '../components/BidHistoryList';
import { AuctionGrid } from '@shared/components/cards';

export interface AuctionDetailPageProps {
  id: string;
  biddingPanel?: ReactNode;
  watchlistToggle?: ReactNode;
  renderSellerFollowToggle?: (sellerId: string) => ReactNode;
}

export function AuctionDetailPage({
  id,
  biddingPanel,
  watchlistToggle,
  renderSellerFollowToggle,
}: AuctionDetailPageProps) {
  const { t, isReady } = useCatalogTranslation();
  const { t: tCommon } = useTranslation('common');
  const { locale } = useLocale();
  const { now } = useServerClock();
  const auction = useAuction(id);
  const bids = useAuctionBids(id, auction.data?.status === 'LIVE');
  const similar = useSimilarAuctions(id);

  if (!isReady || auction.isPending) return <PageLoader />;
  if (auction.isError || !auction.data) {
    return <ErrorState message={t('detail.notFound')} onRetry={() => void auction.refetch()} />;
  }

  const data = auction.data;
  const name = pickLocalizedName(data.product, locale);
  const price = data.currentPrice ?? data.startingPrice;
  const endsInMs = new Date(data.endsAt).getTime() - now();
  const tone = getAuctionStatusTone(data.status, endsInMs);

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-raised">
          {data.product.coverImage ? (
            <Image
              src={data.product.coverImage}
              alt={name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            {watchlistToggle}
          </div>

          <div className="flex items-center gap-2">
            <Badge tone={tone}>{tCommon(getAuctionStatusLabelKey(data.status, endsInMs))}</Badge>
            {data.status === 'LIVE' ? (
              <Countdown endsAt={data.endsAt} className="text-sm text-muted-foreground" />
            ) : null}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {data.currentPrice ? t('detail.currentBid') : t('detail.startingPrice')}
            </p>
            <p className="text-3xl font-bold text-accent">{formatMoney(price)}</p>
            <p className="text-sm text-muted-foreground">
              {t('detail.bids', { count: data.bidCount })}
            </p>
          </div>

          {biddingPanel}

          <Card>
            <CardContent className="flex flex-col gap-2 text-sm">
              <Row label={t('detail.condition')} value={t(`condition.${data.product.condition}`)} />
              <Row
                label={t('detail.seller')}
                value={
                  <span className="flex items-center gap-2">
                    <Link
                      href={ROUTES.sellerProfile(data.seller.id)}
                      className="text-accent hover:underline"
                    >
                      {data.seller.fullName}
                    </Link>
                    {renderSellerFollowToggle?.(data.seller.id)}
                  </span>
                }
              />
              <Row
                label={t('detail.store')}
                value={
                  <Link href={ROUTES.store(data.store.id)} className="text-accent hover:underline">
                    {pickLocalizedName(data.store, locale)}
                  </Link>
                }
              />
              <Row label={t('detail.deliveryFee')} value={formatMoney(data.store.deliveryFee)} />
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t('detail.bidHistory')}</h2>
        {bids.data ? <BidHistoryList bids={bids.data} /> : <PageLoader />}
      </section>

      {similar.data && similar.data.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">{t('detail.similar')}</h2>
          <AuctionGrid auctions={similar.data} />
        </section>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
