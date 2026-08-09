'use client';

import { AuthGuard, AccountPage } from '@features/auth';

export default function Page() {
  return (
    <AuthGuard>
      <AccountPage />
    </AuthGuard>
  );
}
