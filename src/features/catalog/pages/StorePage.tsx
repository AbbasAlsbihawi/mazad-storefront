'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLoader, ErrorState, EmptyState } from '@shared/components/feedback';
import { ScreenHeader } from '@shared/components/layout';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Icon,
  SectionHeader,
  buttonVariants,
} from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useLocale, useMoney } from '@shared/hooks';
import { getErrorCode, getErrorStatus, pickLocalizedName } from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useStore } from '../hooks/useStore';
import { useStoreAuctions } from '../hooks/useStoreAuctions';
import { AuctionGrid, AuctionGridSkeleton } from '@shared/components/cards';

export interface StorePageProps {
  id: string;
  renderSellerFollowToggle?: (sellerId: string) => ReactNode;
}

export function StorePage({ id, renderSellerFollowToggle }: StorePageProps) {
  const { t, isReady } = useCatalogTranslation();
  const { t: tCommon } = useTranslation('common');
  const { locale } = useLocale();
  const { money } = useMoney();
  const router = useRouter();
  const store = useStore(id);
  const auctions = useStoreAuctions(id);

  if (!isReady || store.isPending) return <PageLoader />;
  if (store.isError || !store.data) {
    // A 404 (missing, removed or suspended store, or a banned seller) and a 403 won't change on
    // retry: offer a way on instead. Retry stays for network and server failures, which can.
    const status = getErrorStatus(store.error);
    const isNotFound = status === 404 || getErrorCode(store.error) === 'STORE_NOT_FOUND';
    if (isNotFound || status === 403) {
      // Back where the buyer came from; home when the store was the first page they opened.
      const goBack = () => (window.history.length > 1 ? router.back() : router.push(ROUTES.home));
      return (
        <EmptyState
          icon="store"
          title={t(isNotFound ? 'store.notFound' : 'store.unavailable')}
          message={t(isNotFound ? 'store.notFoundMessage' : 'store.unavailableMessage')}
          action={
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button variant="gray" onClick={goBack}>
                {tCommon('nav.back')}
              </Button>
              <Link href={ROUTES.auctions} className={buttonVariants({ variant: 'tinted' })}>
                {t('detail.browseAuctions')}
              </Link>
            </div>
          }
        />
      );
    }
    return <ErrorState message={t('store.loadError')} onRetry={() => void store.refetch()} />;
  }

  const data = store.data;
  const { sellerRating } = data;
  const hasRating = sellerRating && sellerRating.count > 0 && sellerRating.average != null;

  return (
    <>
      <ScreenHeader title={t('store.title')} backHref={ROUTES.auctions} />

      <div className="flex flex-col gap-5 px-gutter pb-6">
        <Card isInset className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <Icon name="store" size={24} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-title-3 font-bold text-foreground">
                {pickLocalizedName(data, locale)}
              </p>
              <p className="truncate text-footnote text-muted-foreground">{data.city}</p>
            </div>
          </div>

          {/* Verified only when the seller is; a rating only once there are reviews. */}
          {data.seller.isVerified || hasRating ? (
            <div className="flex flex-wrap items-center gap-2 text-footnote">
              {data.seller.isVerified ? (
                <Badge tone="live" data-testid="store-verified">
                  <Icon name="badge-check" size={12} />
                  {t('detail.verifiedSeller')}
                </Badge>
              ) : null}
              {hasRating ? (
                <span className="text-foreground-soft" data-testid="store-rating">
                  {t('detail.ratingValue', {
                    average: sellerRating.average?.toLocaleString(locale === 'ar' ? 'ar' : 'en-US'),
                    count: sellerRating.count,
                  })}
                </span>
              ) : null}
            </div>
          ) : null}

          <CardContent className="flex flex-col gap-2 p-0 text-subhead">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t('store.deliveryFee')}</span>
              <span className="font-medium text-foreground tabular-nums">
                {money(data.deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t('detail.seller')}</span>
              <span className="flex items-center gap-2">
                <Link
                  href={ROUTES.sellerProfile(data.seller.id)}
                  className="font-semibold text-primary-text"
                >
                  {data.seller.fullName}
                </Link>
                {renderSellerFollowToggle?.(data.seller.id)}
              </span>
            </div>
          </CardContent>
        </Card>

        <section>
          <SectionHeader title={t('store.activeAuctions')} />
          {auctions.isPending ? (
            <AuctionGridSkeleton count={4} />
          ) : auctions.isError ? (
            <ErrorState onRetry={() => void auctions.refetch()} />
          ) : auctions.data.data.length === 0 ? (
            <EmptyState icon="gavel" message={t('browse.empty')} />
          ) : (
            <AuctionGrid auctions={auctions.data.data} />
          )}
        </section>
      </div>
    </>
  );
}
