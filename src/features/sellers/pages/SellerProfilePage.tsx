'use client';

import type { ReactNode } from 'react';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { Card, CardContent, CardTitle } from '@shared/components/ui';
import { useLocale } from '@shared/hooks';
import { formatDate } from '@shared/lib';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { useSellersTranslation } from '../hooks/useSellersTranslation';
import { FollowSellerButton } from '../components/FollowSellerButton';
import { SellerStoreList } from '../components/SellerStoreList';

export interface SellerProfilePageProps {
  id: string;
  reviewsSlot?: ReactNode;
  /** The Follow control; the route hides it on the viewer's own profile. */
  renderFollowToggle?: (sellerId: string) => ReactNode;
}

export function SellerProfilePage({ id, reviewsSlot, renderFollowToggle }: SellerProfilePageProps) {
  const { t, isReady } = useSellersTranslation();
  const { locale } = useLocale();
  const seller = useSellerProfile(id);

  if (!isReady || seller.isPending) return <PageLoader />;
  if (seller.isError || !seller.data) {
    return <ErrorState message={t('profile.notFound')} onRetry={() => void seller.refetch()} />;
  }

  const data = seller.data;

  return (
    <div className="flex flex-col gap-6 py-6">
      <Card>
        <CardTitle>{data.fullName}</CardTitle>
        <CardContent className="flex flex-col gap-3 text-sm text-foreground-soft">
          <div className="flex flex-wrap items-center gap-3">
            <p>{t('profile.memberSince', { date: formatDate(data.memberSince, locale) })}</p>
            {renderFollowToggle ? (
              renderFollowToggle(data.id)
            ) : (
              <FollowSellerButton sellerId={data.id} />
            )}
          </div>
          <p>{t('profile.followers', { count: data.followerCount })}</p>
          <p>
            {data.rating.average != null
              ? t('profile.rating', { average: data.rating.average, count: data.rating.count })
              : t('profile.noRating')}
          </p>
        </CardContent>
      </Card>

      {data.stores.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">{t('profile.stores')}</h2>
          <SellerStoreList stores={data.stores} />
        </section>
      ) : null}

      {reviewsSlot}
    </div>
  );
}
