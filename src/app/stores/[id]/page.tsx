'use client';

import { useParams } from 'next/navigation';
import { StorePage } from '@features/catalog';

export default function Page() {
  const params = useParams<{ id: string }>();
  return <StorePage id={params.id} />;
}
