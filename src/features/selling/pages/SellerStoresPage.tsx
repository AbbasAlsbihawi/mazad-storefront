'use client';

import { useState } from 'react';
import { ROUTES } from '@shared/constants';
import { EmptyState, ErrorState, PageLoader } from '@shared/components/feedback';
import { ScreenHeader } from '@shared/components/layout';
import { Badge, Button, Card, CardContent, Icon, Skeleton } from '@shared/components/ui';
import { useLocale, useMoney } from '@shared/hooks';
import { pickLocalizedName } from '@shared/lib';
import { useStores, useDeleteStore } from '../hooks/useStores';
import { useSellingTranslation } from '../hooks/useSellingTranslation';
import { StoreForm } from '../components/StoreForm';
import type { Store } from '../types/selling.types';

export function SellerStoresPage() {
  const { t, isReady } = useSellingTranslation();
  const { locale } = useLocale();
  const { money } = useMoney();
  const stores = useStores();
  const deleteStore = useDeleteStore();

  // One editor open at a time: 'new', a store id, or nothing.
  const [editing, setEditing] = useState<string | null>(null);

  if (!isReady) return <PageLoader />;

  const renderStore = (store: Store) => {
    if (editing === store.id) {
      return (
        <Card key={store.id}>
          <CardContent>
            <StoreForm store={store} onDone={() => setEditing(null)} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={store.id} isInset className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-headline font-semibold text-foreground">
              {pickLocalizedName(store, locale)}
            </p>
            <p className="text-footnote text-muted-foreground">
              {[store.city, store.area].filter(Boolean).join(' · ')}
            </p>
          </div>
          {store.isDefault ? (
            <Badge tone="upcoming" className="shrink-0">
              {t('stores.default')}
            </Badge>
          ) : null}
        </div>

        <p className="text-footnote text-foreground-soft">
          {t('stores.deliveryFee', { fee: money(store.deliveryFee) })}
        </p>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(store.id)}>
            {t('stores.edit')}
          </Button>
          {/* The default store is protected server-side (DEFAULT_STORE_PROTECTED); not offering
              the button is friendlier than surfacing the 409. */}
          {!store.isDefault ? (
            <Button
              size="sm"
              variant="destructive"
              isLoading={deleteStore.isPending && deleteStore.variables === store.id}
              onClick={() => {
                if (window.confirm(t('stores.deleteConfirm'))) deleteStore.mutate(store.id);
              }}
            >
              {t('stores.delete')}
            </Button>
          ) : null}
        </div>
      </Card>
    );
  };

  return (
    <>
      <ScreenHeader title={t('stores.title')} backHref={ROUTES.selling} />

      <div className="flex flex-col gap-3 px-gutter pb-6">
        {stores.isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} radius="lg" className="h-28 w-full" />
            ))}
          </div>
        ) : stores.isError ? (
          <ErrorState onRetry={() => void stores.refetch()} />
        ) : (
          <>
            {stores.data.length === 0 && editing !== 'new' ? (
              <EmptyState icon="store" title={t('stores.empty')} message={t('stores.emptyHint')} />
            ) : (
              stores.data.map(renderStore)
            )}

            {editing === 'new' ? (
              <Card>
                <CardContent>
                  <StoreForm onDone={() => setEditing(null)} />
                </CardContent>
              </Card>
            ) : (
              <Button variant="outline" isFullWidth onClick={() => setEditing('new')}>
                <Icon name="plus" size={18} />
                {t('stores.add')}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
