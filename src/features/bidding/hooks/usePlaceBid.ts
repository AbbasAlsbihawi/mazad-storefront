'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { biddingApi } from '../api/bidding.api';
import { useBiddingTranslation } from './useBiddingTranslation';

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useBiddingTranslation();

  return useMutation({
    mutationFn: (amount: number) => biddingApi.placeBid(auctionId, amount),
    onSuccess: () => {
      // The response's own id/amount can silently belong to another bidder's auto-bid
      // counter-offer (see bidding.schema.ts) — show a neutral toast and reconcile from fresh
      // fetches rather than rendering "your bid of X" from the mutation payload.
      toast.success(t('toast.bidPlaced'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalog.auction(auctionId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalog.auctionBids(auctionId) });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bidding.auctionPricing(auctionId),
      });
    },
  });
}
