'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { addressesApi } from '../api/addresses.api';

export function useAddresses() {
  return useQuery({
    queryKey: QUERY_KEYS.addresses.list,
    queryFn: addressesApi.list,
  });
}
