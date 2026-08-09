'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@shared/constants';
import { PageLoader } from '@shared/components/feedback';
import { getSessionTokens, subscribeToSessionTokens } from '@shared/api';

type SessionStatus = 'pending' | 'authenticated' | 'unauthenticated';

// A guard redirect needs a third state that plain useIsAuthenticated doesn't expose: that hook
// deliberately reads `false` on the server and on the client's first paint to avoid a hydration
// mismatch (see its own comment), which makes "not yet resolved" indistinguishable from "really
// logged out" — redirecting on that shared boolean directly bounced already-authenticated users
// to /login on every fresh full-page load of a guarded route. `pending` is a value the real
// client snapshot can never produce, so the redirect effect below can only ever fire once the
// session state has actually resolved, regardless of exactly when useSyncExternalStore's own
// correction re-render happens relative to this component's effects.
function useSessionStatus(): SessionStatus {
  return useSyncExternalStore(
    subscribeToSessionTokens,
    () => (getSessionTokens() ? 'authenticated' : 'unauthenticated'),
    () => 'pending',
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const status = useSessionStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace(ROUTES.login);
  }, [status, router]);

  if (status !== 'authenticated') return <PageLoader />;
  return <>{children}</>;
}
