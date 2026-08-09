'use client';

import { useState, type MouseEvent } from 'react';
import { Button } from '@shared/components/ui';
import { useIsAuthenticated } from '@shared/hooks';
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

  const isKnownWatched =
    watchlist.data?.data.some((item) => item.auctionId === auctionId) ?? false;
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

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={isWatching}
      aria-label={isWatching ? t('toggle.remove') : t('toggle.add')}
      onClick={handleClick}
      className="bg-surface/80 backdrop-blur-sm hover:bg-surface"
    >
      <HeartIcon filled={isWatching} />
    </Button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 text-accent"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4A5.5 5.5 0 0112 7a5.5 5.5 0 016.5-3c3.5.5 5 4 3.5 7.7C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}
