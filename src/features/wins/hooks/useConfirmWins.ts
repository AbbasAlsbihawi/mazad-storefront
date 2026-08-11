'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { winsApi } from '../api/wins.api';
import { useWinsTranslation } from './useWinsTranslation';
import type { ConfirmWinsInput } from '../types/wins.types';

export function useConfirmWins() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useWinsTranslation();

  return useMutation({
    mutationFn: (input: ConfirmWinsInput) => winsApi.confirm(input),
    onSuccess: () => {
      toast.success(t('toast.confirmed'));
      // Confirming mints orders, so both lists are now stale — and my-bids shows the standing
      // that just moved from AWAITING_CONFIRMATION to WON.
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wins.list });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list });
      void queryClient.invalidateQueries({ queryKey: ['bidding', 'myBids'] });
    },
  });
}

export function useDeclineWin() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useWinsTranslation();

  return useMutation({
    mutationFn: (winId: string) => winsApi.decline(winId),
    onSuccess: () => {
      toast.info(t('toast.declined'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wins.list });
      void queryClient.invalidateQueries({ queryKey: ['bidding', 'myBids'] });
    },
  });
}
