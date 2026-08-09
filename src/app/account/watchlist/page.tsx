'use client';

import { AuthGuard } from '@features/auth';
import { WatchlistPage } from '@features/watchlist';

export default function Page() {
  return (
    <AuthGuard>
      <WatchlistPage />
    </AuthGuard>
  );
}
