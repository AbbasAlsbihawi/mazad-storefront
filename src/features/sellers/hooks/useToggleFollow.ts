'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { sellersApi } from '../api/sellers.api';
import { useSellersTranslation } from './useSellersTranslation';

// Same shape as watchlist's useToggleWatch — optimism lives in the calling component's own
// local state (see FollowSellerButton), not here.
export function useToggleFollow(sellerId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useSellersTranslation();

  return useMutation({
    mutationFn: (nextFollowing: boolean) =>
      nextFollowing ? sellersApi.follow(sellerId) : sellersApi.unfollow(sellerId),
    onSuccess: (result) => {
      toast.success(t(result.following ? 'toast.followed' : 'toast.unfollowed'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sellers.following });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sellers.profile(sellerId) });
    },
  });
}
