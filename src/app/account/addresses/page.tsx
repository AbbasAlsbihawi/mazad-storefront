'use client';

import { AuthGuard } from '@features/auth';
import { AddressesPage } from '@features/addresses';

export default function Page() {
  return (
    <AuthGuard>
      <AddressesPage />
    </AuthGuard>
  );
}
