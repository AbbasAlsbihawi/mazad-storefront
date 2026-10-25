'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { useCountdown, useLocale } from '@shared/hooks';
import {
  cn,
  formatDuration,
  getAuctionStatusLabelKey,
  getAuctionStatusTone,
  pickLocalizedName,
  resolveAssetUrl,
} from '@shared/lib';
import { Badge, GoldTile, Price } from '@shared/components/ui';
import type { AuctionSummary } from '@shared/types';
import { useAuctionCardAction } from './AuctionCardActionSlot';

export interface AuctionCardProps {
  auction: AuctionSummary;
  /** Above-the-fold cards load their photo eagerly. */
  isPriority?: boolean;
}

/**
 * The full-photo lot card (design `.lot.fp`): the photo is the card. Status and time sit on top,
 * the heart in the corner, the name and price on a dark fade at the foot, light text in both
 * themes. Ended lots are dimmed rather than removed.
 */
export function AuctionCard({ auction, isPriority = false }: AuctionCardProps) {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const renderAction = useAuctionCardAction();

  // Re-renders the whole card once a second: the badge is derived from the same remaining time,
  // so ticking only the clock would leave "ending soon" against a timer that had run out.
  const endsInMs = useCountdown(auction.endsAt);
  const startsInMs = useCountdown(auction.startsAt);

  const name = pickLocalizedName(auction.product, locale);
  const coverImage = resolveAssetUrl(auction.product.coverImage);
  const isLive = auction.status === 'LIVE';
  const isUpcoming = auction.status === 'SCHEDULED';
  const isEnded = !isLive && !isUpcoming;
  const tone = getAuctionStatusTone(auction.status, endsInMs);
  const label = isUpcoming
    ? t('card.startsIn')
    : t(getAuctionStatusLabelKey(auction.status, endsInMs));
  const clock = isLive && endsInMs > 0 ? endsInMs : isUpcoming && startsInMs > 0 ? startsInMs : 0;
  const price = auction.currentPrice ?? auction.startingPrice;

  return (
    <div className="relative">
      <Link
        href={ROUTES.auctionDetail(auction.id)}
        className="group block rounded-[22px] focus-visible:outline-offset-4"
      >
        <span className="relative block aspect-[3/4] overflow-hidden rounded-[22px] border border-border bg-surface-raised">
          {coverImage ? (
            <Image
              src={coverImage}
              alt=""
              fill
              priority={isPriority}
              sizes="(min-width: 960px) 260px, 50vw"
              className={cn(
                'object-cover transition-transform duration-[600ms] ease-ios group-hover:scale-[1.04]',
                isEnded && 'brightness-[0.72] grayscale-[0.8]',
              )}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-tile pb-16">
              <GoldTile icon="package" size="lg" />
            </span>
          )}
          <span aria-hidden className="absolute inset-0 bg-lot-shade" />

          <span className="absolute start-2.5 end-[52px] top-2.5 flex flex-wrap items-center gap-1.5 text-on-photo">
            <Badge tone="photo" hasDot={tone === 'live' || tone === 'warning'}>
              {label}
            </Badge>
            {clock > 0 ? (
              <span className="inline-block rounded-full bg-[rgb(12_11_10/55%)] px-[9px] py-[3px] font-tabular text-[12.5px] font-semibold backdrop-blur-[8px] [unicode-bidi:isolate]">
                {formatDuration(clock, locale)}
              </span>
            ) : null}
          </span>

          <span className="absolute inset-x-3 bottom-3 grid gap-0.5 text-on-photo">
            <span className="line-clamp-2 text-sm leading-[1.45] [text-shadow:0_1px_8px_rgb(0_0_0/50%)] en:font-medium">
              {name}
            </span>
            <span className="mt-0.5 flex items-center justify-between gap-1.5">
              <Price value={price} tone={isEnded ? 'photoPlain' : 'photo'} size="md" />
              <span className="text-xs whitespace-nowrap text-on-photo/72">
                {t('card.bids', { count: auction.bidCount })}
              </span>
            </span>
          </span>
        </span>
      </Link>

      {renderAction ? (
        <div className="absolute end-[5px] top-[5px] z-10">{renderAction(auction.id)}</div>
      ) : null}
    </div>
  );
}
