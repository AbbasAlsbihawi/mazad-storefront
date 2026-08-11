'use client';

import { AuthGuard } from '@features/auth';
import { OrdersPage } from '@features/orders';

export default function Page() {
  return (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  );
}
