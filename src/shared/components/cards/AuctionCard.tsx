'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'node_modules/react-i18next';
import { ROUTES } from '@shared/constants';
import { useLocale, useServerClock } from '@shared/hooks';
import {
  formatMoney,
  formatDuration,
  pickLocalizedName,
  getAuctionStatusTone,
  getAuctionStatusLabelKey,
} from '@shared/lib';
import { Badge, Card } from '@shared/components/ui';
import type { AuctionSummary } from '@shared/types';
import { useAuctionCardAction } from './AuctionCardActionSlot';

export interface AuctionCardProps {
  auction: AuctionSummary;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const { now } = useServerClock();
  const renderAction = useAuctionCardAction();

  const name = pickLocalizedName(auction.product, locale);
  const endsInMs = new Date(auction.endsAt).getTime() - now();
  const price = auction.currentPrice ?? auction.startingPrice;
  const tone = getAuctionStatusTone(auction.status, endsInMs);
  const label = t(getAuctionStatusLabelKey(auction.status, endsInMs));

  return (
    <div className="relative h-full">
      <Link href={ROUTES.auctionDetail(auction.id)} className="block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-accent/50">
          <div className="relative aspect-square w-full bg-surface-raised">
            {auction.product.coverImage ? (
              <Image
                src={auction.product.coverImage}
                alt={name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            ) : null}
            <Badge tone={tone} className="absolute start-2 top-2">
              {label}
            </Badge>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-3">
            <p className="line-clamp-2 text-sm font-medium text-foreground">{name}</p>
            <p className="mt-auto text-base font-semibold text-accent">{formatMoney(price)}</p>
            {auction.status === 'LIVE' && endsInMs > 0 ? (
              <p className="text-xs text-muted-foreground">{formatDuration(endsInMs)}</p>
            ) : null}
          </div>
        </Card>
      </Link>
      {renderAction ? (
        <div className="absolute end-2 top-2 z-10">{renderAction(auction.id)}</div>
      ) : null}
    </div>
  );
}
