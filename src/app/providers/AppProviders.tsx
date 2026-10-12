'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { ErrorBoundary } from '@shared/components/feedback';
import { Toaster } from '@shared/components/ui';
import { QueryProvider } from './QueryProvider';
import { I18nProvider } from './I18nProvider';
import { ServiceWorkerRegistrar } from './ServiceWorkerRegistrar';

// The account's notification language follows the app's (PATCH /me). Loaded on the side, like
// AppShell's WatchlistToggle, so the auth feature stays out of every route's first chunk.
const LocaleSync = dynamic(
  () => import('@features/auth').then((m) => ({ default: m.LocaleSync })),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <I18nProvider>
          {children}
          <Toaster />
          <ServiceWorkerRegistrar />
          <LocaleSync />
        </I18nProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
