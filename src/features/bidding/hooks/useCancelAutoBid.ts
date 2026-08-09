'use client';

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@shared/hooks';
import { biddingApi } from '../api/bidding.api';
import { useBiddingTranslation } from './useBiddingTranslation';

export function useCancelAutoBid(auctionId: string) {
  const toast = useToast();
  const { t } = useBiddingTranslation();

  return useMutation({
    mutationFn: () => biddingApi.cancelAutoBid(auctionId),
    onSuccess: () => {
      toast.success(t('toast.autoBidCancelled'));
    },
  });
}
