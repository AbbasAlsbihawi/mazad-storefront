'use client';

import { AuthGuard } from '@features/auth';
import { SellerStoresPage } from '@features/selling';

export default function Page() {
  return (
    <AuthGuard>
      <SellerStoresPage />
    </AuthGuard>
  );
}
