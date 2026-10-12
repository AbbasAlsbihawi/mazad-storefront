'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { buttonVariants } from '@shared/components/ui';
import { EmptyState } from './EmptyState';

/** The app's 404: what happened, and the two ways on (home, or browse the auctions). */
export function NotFoundScreen() {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-[60dvh] flex-col justify-center px-gutter" data-testid="not-found">
      <EmptyState
        icon="search"
        title={t('notFound.title')}
        message={t('notFound.message')}
        action={<RecoveryLinks />}
      />
    </div>
  );
}

/** Home and Browse, the same pair on the 404 and the error screen. */
export function RecoveryLinks({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation('common');
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      {onRetry ? (
        <button type="button" onClick={onRetry} className={buttonVariants({ variant: 'filled' })}>
          {t('state.retry')}
        </button>
      ) : null}
      <Link href={ROUTES.home} className={buttonVariants({ variant: 'gray' })}>
        {t('recovery.home')}
      </Link>
      <Link href={ROUTES.auctions} className={buttonVariants({ variant: 'tinted' })}>
        {t('recovery.browse')}
      </Link>
    </div>
  );
}
