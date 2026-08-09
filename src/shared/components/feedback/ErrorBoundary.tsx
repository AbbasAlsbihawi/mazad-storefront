'use client';

import { Component, type ReactNode } from 'react';
import { useTranslation } from 'node_modules/react-i18next';
import { Button } from '@shared/components/ui';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Class component is the one exception to "functional components only" (CODE_STYLE.md) —
// React has no hook-based error boundary API.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.error(error);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}

function DefaultErrorFallback() {
  const { t } = useTranslation('common');

  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <p className="text-foreground-soft">{t('state.error')}</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        {t('state.retry')}
      </Button>
    </div>
  );
}
