'use client';

import { AuthGuard } from '@features/auth';
import { MyBidsPage } from '@features/bidding';

export default function Page() {
  return (
    <AuthGuard>
      <MyBidsPage />
    </AuthGuard>
  );
}
