'use client';

import { useState, type MouseEvent } from 'react';
import { Icon } from '@shared/components/ui';
import { useIsAuthenticated } from '@shared/hooks';
import { cn } from '@shared/lib';
import { useWatchlist } from '../hooks/useWatchlist';
import { useToggleWatch } from '../hooks/useToggleWatch';
import { useWatchlistTranslation } from '../hooks/useWatchlistTranslation';

export interface WatchlistToggleProps {
  auctionId: string;
}

export function WatchlistToggle({ auctionId }: WatchlistToggleProps) {
  const { t } = useWatchlistTranslation();
  const isAuthenticated = useIsAuthenticated();
  const watchlist = useWatchlist();
  const toggle = useToggleWatch(auctionId);

  const isKnownWatched = watchlist.data?.data.some((item) => item.auctionId === auctionId) ?? false;
  // Set only on click, cleared only on error (back to the pre-click value) — never synced from
  // isKnownWatched via an effect. On success there's nothing to revert to: this value already
  // matches what the server now has, and what isKnownWatched will read once its query refetches.
  const [optimisticOverride, setOptimisticOverride] = useState<boolean | null>(null);
  const isWatching = optimisticOverride ?? isKnownWatched;

  if (!isAuthenticated) return null;

  const handleClick = (event: MouseEvent) => {
    // Rendered next to a Link (see AuctionCard's action slot) — never let the click navigate.
    event.preventDefault();
    event.stopPropagation();
    const next = !isWatching;
    setOptimisticOverride(next);
    toggle.mutate(next, { onError: () => setOptimisticOverride(!next) });
  };

  // A 34px dark-glass disc (design .lot .fav) inside a 44px hit area, so the touch target clears
  // the minimum without crowding the photo. Dark in both themes: it always sits on a photo.
  return (
    <button
      type="button"
      aria-pressed={isWatching}
      aria-label={isWatching ? t('toggle.remove') : t('toggle.add')}
      onClick={handleClick}
      className="inline-flex size-touch items-center justify-center"
    >
      <span
        className={cn(
          'inline-flex size-[34px] items-center justify-center rounded-full',
          'bg-[rgb(12_11_10/45%)] backdrop-blur-[8px]',
          'transition-transform duration-fast ease-ios active:scale-90',
          isWatching ? 'text-on-photo-gold' : 'text-on-photo',
        )}
      >
        <Icon name="heart" size={17} isFilled={isWatching} />
      </span>
    </button>
  );
}
