'use client';

import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { Card, CardContent, CardTitle } from '@shared/components/ui';
import { useLocale } from '@shared/hooks';
import { formatMoney, pickLocalizedName } from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useStore } from '../hooks/useStore';
import { useStoreAuctions } from '../hooks/useStoreAuctions';
import { AuctionGrid } from '@shared/components/cards';

export function StorePage({ id }: { id: string }) {
  const { t, isReady } = useCatalogTranslation();
  const { locale } = useLocale();
  const store = useStore(id);
  const auctions = useStoreAuctions(id);

  if (!isReady || store.isPending) return <PageLoader />;
  if (store.isError || !store.data) {
    return <ErrorState message={t('store.notFound')} onRetry={() => void store.refetch()} />;
  }

  const data = store.data;

  return (
    <div className="flex flex-col gap-6 py-6">
      <Card>
        <CardTitle>{pickLocalizedName(data, locale)}</CardTitle>
        <CardContent className="flex flex-col gap-1 text-sm text-foreground-soft">
          <p>
            {data.city}
            {data.area ? `, ${data.area}` : ''}
          </p>
          {data.contactPhone ? <p>{data.contactPhone}</p> : null}
          <p>
            {t('store.deliveryFee')}: {formatMoney(data.deliveryFee)}
          </p>
          <p className="text-muted-foreground">{data.seller.fullName}</p>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t('store.activeAuctions')}</h2>
        {auctions.isPending ? (
          <PageLoader />
        ) : auctions.isError ? (
          <ErrorState onRetry={() => void auctions.refetch()} />
        ) : auctions.data.data.length === 0 ? (
          <EmptyState message={t('browse.empty')} />
        ) : (
          <AuctionGrid auctions={auctions.data.data} />
        )}
      </section>
    </div>
  );
}
