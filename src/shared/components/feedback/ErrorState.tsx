'use client';

import { useTranslation } from 'node_modules/react-i18next';
import { Button } from '@shared/components/ui';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');

  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <p className="text-foreground-soft">{message ?? t('state.error')}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('state.retry')}
        </Button>
      ) : null}
    </div>
  );
}
