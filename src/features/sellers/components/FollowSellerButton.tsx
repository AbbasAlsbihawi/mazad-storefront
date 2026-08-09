'use client';

import { useState } from 'react';
import { useTranslation } from 'node_modules/react-i18next';
import { Button } from '@shared/components/ui';
import { useIsAuthenticated } from '@shared/hooks';
import { getErrorCode } from '@shared/lib';
import { useFollowing } from '../hooks/useFollowing';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { useSellersTranslation } from '../hooks/useSellersTranslation';

export interface FollowSellerButtonProps {
  sellerId: string;
}

// Same optimistic-override shape as watchlist's WatchlistToggle — see that file's comment for
// why there's no useEffect syncing local state from the query result.
export function FollowSellerButton({ sellerId }: FollowSellerButtonProps) {
  const { t } = useSellersTranslation();
  const { t: tCommon } = useTranslation('common');
  const isAuthenticated = useIsAuthenticated();
  const following = useFollowing();
  const toggle = useToggleFollow(sellerId);

  const isKnownFollowing = following.data?.data.some((item) => item.sellerId === sellerId) ?? false;
  const [optimisticOverride, setOptimisticOverride] = useState<boolean | null>(null);
  const isFollowing = optimisticOverride ?? isKnownFollowing;
  const errorCode = getErrorCode(toggle.error);

  if (!isAuthenticated) return null;

  const handleClick = () => {
    const next = !isFollowing;
    setOptimisticOverride(next);
    toggle.mutate(next, { onError: () => setOptimisticOverride(!next) });
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant={isFollowing ? 'outline' : 'default'}
        size="sm"
        isLoading={toggle.isPending}
        onClick={handleClick}
      >
        {isFollowing ? t('follow.following') : t('follow.follow')}
      </Button>
      {errorCode ? (
        <p role="alert" className="text-xs text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
    </div>
  );
}
