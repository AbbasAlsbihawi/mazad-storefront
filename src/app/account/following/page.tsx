'use client';

import { AuthGuard } from '@features/auth';
import { FollowingPage } from '@features/sellers';

export default function Page() {
  return (
    <AuthGuard>
      <FollowingPage />
    </AuthGuard>
  );
}
