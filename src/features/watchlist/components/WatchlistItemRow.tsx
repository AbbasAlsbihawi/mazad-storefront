'use client';

import Link from 'next/link';
import { Button } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useLocale } from '@shared/hooks';
import { formatMoney, pickLocalizedName } from '@shared/lib';
import { useToggleWatch } from '../hooks/useToggleWatch';
import { useWatchlistTranslation } from '../hooks/useWatchlistTranslation';
import type { WatchlistItem } from '../types/watchlist.types';

export interface WatchlistItemRowProps {
  item: WatchlistItem;
}

export function WatchlistItemRow({ item }: WatchlistItemRowProps) {
  const { t } = useWatchlistTranslation();
  const { locale } = useLocale();
  const toggle = useToggleWatch(item.auctionId);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Link href={ROUTES.auctionDetail(item.auctionId)} className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          {pickLocalizedName(item.auction.product, locale)}
        </p>
        <p className="text-sm text-foreground-soft">
          {formatMoney(item.auction.currentPrice ?? item.auction.startingPrice)}
        </p>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        isLoading={toggle.isPending}
        onClick={() => toggle.mutate(false)}
      >
        {t('toggle.remove')}
      </Button>
    </div>
  );
}
