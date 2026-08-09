'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from '@shared/components/feedback';
import { Toaster } from '@shared/components/ui';
import { QueryProvider } from './QueryProvider';
import { I18nProvider } from './I18nProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
