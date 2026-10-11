'use client';

import { useParams } from 'next/navigation';
import { StorePage } from '@features/catalog';
import { SellerFollowToggle } from '@app/sellers/SellerFollowToggle';

export function StorePageClient() {
  const params = useParams<{ id: string }>();
  return (
    <StorePage
      id={params.id}
      renderSellerFollowToggle={(sellerId) => <SellerFollowToggle sellerId={sellerId} />}
    />
  );
}
