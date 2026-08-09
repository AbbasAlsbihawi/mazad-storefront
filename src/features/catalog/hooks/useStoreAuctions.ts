'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { catalogApi } from '../api/catalog.api';

/** /stores/:id itself always returns an empty `auctions` placeholder, so the store page fetches
 *  the store's listings the same way the browse page fetches anyone's: filtered /auctions. */
export function useStoreAuctions(storeId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctions({ storeId }),
    queryFn: () => catalogApi.listAuctions({ storeId }),
    enabled: !!storeId,
  });
}
