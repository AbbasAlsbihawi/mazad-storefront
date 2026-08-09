'use client';

import Link from 'next/link';
import { Button } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { useSellersTranslation } from '../hooks/useSellersTranslation';
import type { FollowingItem } from '../types/sellers.types';

export interface FollowingListRowProps {
  item: FollowingItem;
}

export function FollowingListRow({ item }: FollowingListRowProps) {
  const { t } = useSellersTranslation();
  const toggle = useToggleFollow(item.sellerId);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <Link
        href={ROUTES.sellerProfile(item.sellerId)}
        className="text-sm font-medium text-foreground hover:text-accent"
      >
        {item.seller.fullName}
      </Link>
      <Button
        variant="ghost"
        size="sm"
        isLoading={toggle.isPending}
        onClick={() => toggle.mutate(false)}
      >
        {t('follow.unfollow')}
      </Button>
    </div>
  );
}
