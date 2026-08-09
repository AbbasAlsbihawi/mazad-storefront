'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useToast } from '@shared/hooks';
import { addressesApi } from '../api/addresses.api';
import { useAddressesTranslation } from './useAddressesTranslation';
import type { AddressFormValues } from '../types/addresses.types';

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useAddressesTranslation();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AddressFormValues }) =>
      addressesApi.update(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.list });
      toast.success(t('toast.updated'));
    },
  });
}
