'use client';

import { useTranslation } from 'react-i18next';
import { Badge, Icon } from '@shared/components/ui';
import { useCountdown, useLocale, useMoney } from '@shared/hooks';
import {
  formatDateTime,
  formatDuration,
  getAuctionStatusLabelKey,
  getAuctionStatusTone,
} from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { Auction } from '../types/catalog.types';
import { DetailRow } from './DetailSection';

/**
 * Where the auction stands: status with the countdown (to the end, or to the start of an upcoming
 * one), bidders and bids, the exact start and end, and how much late bids extended it.
 */
export function AuctionInfoSection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  const { t: tCommon } = useTranslation('common');
  const { locale } = useLocale();
  const { number } = useMoney();
  // Ticks every second on the shared interval, anchored to the server clock (ADR-013).
  const endsInMs = useCountdown(auction.endsAt);
  const startsInMs = useCountdown(auction.status === 'SCHEDULED' ? auction.startsAt : undefined);

  const tone = getAuctionStatusTone(auction.status, endsInMs);
  const isLive = auction.status === 'LIVE';
  const isOver =
    auction.status === 'ENDED' || auction.status === 'SOLD' || auction.status === 'UNSOLD';
  const extendedMinutes = Math.round(
    (new Date(auction.endsAt).getTime() - new Date(auction.originalEndsAt).getTime()) / 60_000,
  );
  const bids = t('detail.bids', {
    count: auction.bidCount,
    formattedCount: number(auction.bidCount),
  });
  // "3 bidders · 5 bids" (bids count automatic ones); just "No bids yet" before the first.
  const activity =
    auction.bidCount > 0 && auction.bidderCount != null
      ? `${t('detail.bidders', { count: auction.bidderCount })} · ${bids}`
      : bids;

  return (
    <div className="mt-4 flex flex-col gap-2" data-testid="detail-auction-info">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tone} hasDot={tone === 'live'}>
          {tCommon(getAuctionStatusLabelKey(auction.status, endsInMs))}
        </Badge>
        {isLive && endsInMs > 0 ? (
          <span className="inline-flex items-center gap-1 text-footnote text-muted-foreground tabular-nums">
            <Icon name="clock" size={14} />
            {formatDuration(endsInMs, locale)}
          </span>
        ) : null}
        {auction.status === 'SCHEDULED' && startsInMs > 0 ? (
          <span
            className="inline-flex items-center gap-1 text-footnote text-muted-foreground tabular-nums"
            data-testid="detail-starts-in"
          >
            <Icon name="clock" size={14} />
            {t('detail.startsIn')} {formatDuration(startsInMs, locale)}
          </span>
        ) : null}
        {isOver ? (
          <span className="text-footnote text-muted-foreground" data-testid="detail-ended-at">
            {t('detail.endedAt', { time: formatDateTime(auction.endsAt, locale) })}
          </span>
        ) : null}
        <span
          className="inline-flex items-center gap-1.5 text-footnote text-muted-foreground"
          data-testid="detail-activity"
        >
          <Icon name="gavel" size={14} />
          {activity}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-footnote">
        <DetailRow label={t('detail.starts')} value={formatDateTime(auction.startsAt, locale)} />
        <DetailRow label={t('detail.ends')} value={formatDateTime(auction.endsAt, locale)} />
      </div>
      {extendedMinutes > 0 ? (
        <span className="text-footnote text-muted-foreground" data-testid="detail-extended">
          {t('detail.extended', { count: extendedMinutes })}
        </span>
      ) : null}
    </div>
  );
}
