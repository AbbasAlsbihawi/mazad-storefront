'use client';

import { AuthGuard } from '@features/auth';
import { useOpenSalesCount } from '@features/orders';
import { SellerHubPage } from '@features/selling';

/** The hub, with the count of received orders that still need the seller (orders feature). */
function SellingHub() {
  const openSalesCount = useOpenSalesCount();
  return <SellerHubPage openSalesCount={openSalesCount} />;
}

export default function Page() {
  return (
    <AuthGuard>
      <SellingHub />
    </AuthGuard>
  );
}
