'use client';

import { useTranslation } from 'react-i18next';
import { Icon } from '@shared/components/ui';
import { RecoveryLinks } from './NotFoundScreen';

/**
 * A page that failed to render (the route's error boundary): say so plainly, offer to try again,
 * or go home or to the auctions. Never the error's own text, which may be technical.
 */
export function RouteErrorScreen({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation('common');
  return (
    <div
      role="alert"
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-2.5 px-8 py-12 text-center"
      data-testid="route-error"
    >
      <span className="mb-1 inline-flex size-16 items-center justify-center rounded-xl bg-destructive/12">
        <Icon name="x" size={28} className="text-destructive" />
      </span>
      <p className="text-title-3 font-bold text-foreground">{t('errorPage.title')}</p>
      <p className="max-w-70 text-subhead text-muted-foreground">{t('errorPage.message')}</p>
      <RecoveryLinks onRetry={onRetry} />
    </div>
  );
}
