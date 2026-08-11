'use client';

import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@shared/components/ui';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** ErrorState — EmptyState's shape with a destructive glyph and a retry. */
export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2.5 px-8 py-12 text-center"
    >
      <span className="mb-1 inline-flex size-16 items-center justify-center rounded-xl bg-destructive/12">
        <Icon name="x" size={28} className="text-destructive" />
      </span>
      <p className="text-title-3 font-bold text-foreground">{title ?? t('state.error')}</p>
      <p className="max-w-70 text-subhead text-muted-foreground">
        {message ?? t('state.errorDetail')}
      </p>
      {onRetry ? (
        <Button variant="tinted" onClick={onRetry} className="mt-2">
          {t('state.retry')}
        </Button>
      ) : null}
    </div>
  );
}
