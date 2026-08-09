'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { Badge, Chip } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useLocale } from '@shared/hooks';
import { formatMoney, pickLocalizedName } from '@shared/lib';
import { useMyBids } from '../hooks/useMyBids';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import type { BidStanding } from '../types/bidding.types';

const STANDINGS: BidStanding[] = ['WINNING', 'OUTBID', 'AWAITING_CONFIRMATION', 'WON', 'LOST'];

const STANDING_TONE: Record<BidStanding, 'live' | 'warning' | 'upcoming' | 'neutral'> = {
  WINNING: 'live',
  OUTBID: 'warning',
  AWAITING_CONFIRMATION: 'upcoming',
  WON: 'live',
  LOST: 'neutral',
};

export function MyBidsPage() {
  const { t, isReady } = useBiddingTranslation();
  const { locale } = useLocale();
  const [standing, setStanding] = useState<BidStanding | undefined>(undefined);
  const { data, isPending, isError, refetch } = useMyBids({ standing, limit: 50 });

  if (!isReady || isPending) return <PageLoader />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">{t('myBids.title')}</h1>

      <div className="flex flex-wrap gap-2">
        <Chip isActive={!standing} onClick={() => setStanding(undefined)}>
          {t('myBids.filters.all')}
        </Chip>
        {STANDINGS.map((value) => (
          <Chip key={value} isActive={standing === value} onClick={() => setStanding(value)}>
            {t(`standing.${value}`)}
          </Chip>
        ))}
      </div>

      {data.data.length === 0 ? (
        <EmptyState message={t('myBids.empty')} />
      ) : (
        <div className="flex flex-col gap-3">
          {data.data.map((item) => (
            <Link
              key={item.auctionId}
              href={ROUTES.auctionDetail(item.auctionId)}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-accent/50"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                {item.auction.product.coverImage ? (
                  <Image
                    src={item.auction.product.coverImage}
                    alt={pickLocalizedName(item.auction.product, locale)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  {pickLocalizedName(item.auction.product, locale)}
                </p>
                <p className="text-sm text-foreground-soft">
                  {t('myBids.yourBid', { amount: formatMoney(item.myHighestBid) })}
                </p>
              </div>
              <Badge tone={STANDING_TONE[item.standing]}>{t(`standing.${item.standing}`)}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
