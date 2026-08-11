'use client';

import { Suspense } from 'react';
import { AuctionsBrowsePage } from '@features/catalog';
import { PageLoader } from '@shared/components/feedback';

// The browse screen reads its filters from useSearchParams(), which opts the route out of
// prerendering unless it sits behind a Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AuctionsBrowsePage />
    </Suspense>
  );
}
