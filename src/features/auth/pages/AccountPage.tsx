'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { Button, Card, CardContent, CardTitle } from '@shared/components/ui';
import { useAuthTranslation } from '../hooks/useAuthTranslation';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useLogout } from '../hooks/useLogout';

export function AccountPage() {
  const { t, isReady } = useAuthTranslation();
  const { data: user, isPending, isError, refetch } = useCurrentUser();
  const logout = useLogout();

  if (!isReady || isPending) return <PageLoader />;
  if (isError || !user) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">{t('account.title')}</h1>
      <Card>
        <CardTitle>{user.fullName}</CardTitle>
        <CardContent className="flex flex-col gap-1 text-sm text-foreground-soft">
          <p>{user.phone}</p>
          {user.isVerified ? <p className="text-live">{t('account.verified')}</p> : null}
        </CardContent>
      </Card>

      <nav aria-label={t('account.quickLinks')} className="flex flex-col gap-1">
        <Link
          href={ROUTES.addressesList}
          className="text-sm font-medium text-accent hover:underline"
        >
          {t('account.addresses')}
        </Link>
        <Link href={ROUTES.myBids} className="text-sm font-medium text-accent hover:underline">
          {t('account.myBids')}
        </Link>
        <Link
          href={ROUTES.watchlistList}
          className="text-sm font-medium text-accent hover:underline"
        >
          {t('account.watchlist')}
        </Link>
      </nav>

      <Button variant="outline" isLoading={logout.isPending} onClick={() => logout.mutate()}>
        {t('account.signOut')}
      </Button>
    </div>
  );
}
