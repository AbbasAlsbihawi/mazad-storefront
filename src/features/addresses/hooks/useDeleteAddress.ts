'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { addressesApi } from '../api/addresses.api';
import { useAddressesTranslation } from './useAddressesTranslation';

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useAddressesTranslation();

  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.list });
      toast.success(t('toast.deleted'));
    },
  });
}
