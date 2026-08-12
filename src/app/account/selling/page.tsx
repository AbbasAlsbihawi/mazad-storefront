'use client';

import { AuthGuard } from '@features/auth';
import { SellerHubPage } from '@features/selling';

export default function Page() {
  return (
    <AuthGuard>
      <SellerHubPage />
    </AuthGuard>
  );
}
