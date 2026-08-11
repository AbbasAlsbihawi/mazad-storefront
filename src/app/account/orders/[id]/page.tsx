'use client';

import { useParams } from 'next/navigation';
import { AuthGuard } from '@features/auth';
import { OrderDetailPage } from '@features/orders';

export default function Page() {
  const params = useParams<{ id: string }>();

  return (
    <AuthGuard>
      <OrderDetailPage id={params.id} />
    </AuthGuard>
  );
}
