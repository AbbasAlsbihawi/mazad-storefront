'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@shared/constants';
import { PageLoader } from '@shared/components/feedback';
import { useIsAuthenticated } from '@shared/hooks';

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace(ROUTES.login);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <PageLoader />;
  return <>{children}</>;
}
