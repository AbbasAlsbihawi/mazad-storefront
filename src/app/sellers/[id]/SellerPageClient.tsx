'use client';

import { useParams } from 'next/navigation';
import { SellerProfilePage } from '@features/sellers';
import { SellerFollowToggle } from '@app/sellers/SellerFollowToggle';

export function SellerPageClient() {
  const params = useParams<{ id: string }>();
  return (
    <SellerProfilePage
      id={params.id}
      renderFollowToggle={(sellerId) => <SellerFollowToggle sellerId={sellerId} />}
    />
  );
}
