'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@features/auth';
import { PageLoader } from '@shared/components/feedback';
import { SellerAuctionsPage } from '@features/selling';

// useSearchParams needs a Suspense boundary above it or the whole route opts out of static
// rendering (Next.js bails the prerender otherwise).
function SellerAuctionsRoute() {
  const searchParams = useSearchParams();

  return <SellerAuctionsPage initialProductId={searchParams.get('productId') ?? undefined} />;
}

export default function Page() {
  return (
    <AuthGuard>
      <Suspense fallback={<PageLoader />}>
        <SellerAuctionsRoute />
      </Suspense>
    </AuthGuard>
  );
}
