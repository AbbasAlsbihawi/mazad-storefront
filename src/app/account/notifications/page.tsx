'use client';

import { AuthGuard } from '@features/auth';
import { NotificationsPage } from '@features/notifications';

export default function Page() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
