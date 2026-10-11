'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROUTES } from '@shared/constants';
import { Badge, Icon } from '@shared/components/ui';
import { useLocale } from '@shared/hooks';
import { pickLocalizedName } from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { Auction } from '../types/catalog.types';
import { DetailSection } from './DetailSection';

/**
 * Who sells it: the store (with a way to it), the seller, their city, "Verified seller" only when
 * they are, and the rating once there are reviews. Never a phone, street or location — the API
 * doesn't send them.
 */
export function SellerCard({
  auction,
  followToggle,
}: {
  auction: Auction;
  followToggle?: ReactNode;
}) {
  const { t } = useCatalogTranslation();
  const { locale } = useLocale();
  const { seller, store, sellerRating } = auction;
  const hasRating = sellerRating && sellerRating.count > 0 && sellerRating.average != null;

  return (
    <DetailSection
      title={t('detail.seller')}
      testId="detail-seller"
      action={
        <Link
          href={ROUTES.store(store.id)}
          className="text-subhead font-semibold text-primary-text"
        >
          {t('detail.viewStore')}
        </Link>
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-headline font-semibold text-foreground">
            {pickLocalizedName(store, locale)}
          </span>
          <Link
            href={ROUTES.sellerProfile(seller.id)}
            className="truncate font-medium text-primary-text"
          >
            {seller.fullName}
          </Link>
          <span className="inline-flex items-center gap-1 text-footnote text-muted-foreground">
            <Icon name="map-pin" size={14} />
            {store.city}
          </span>
        </div>
        {followToggle ? <div className="shrink-0">{followToggle}</div> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-footnote">
        {/* Verified only when the seller is; a rating only once there are reviews. */}
        {seller.isVerified ? (
          <Badge tone="live" data-testid="seller-verified">
            <Icon name="badge-check" size={12} />
            {t('detail.verifiedSeller')}
          </Badge>
        ) : null}
        <span className="text-foreground-soft" data-testid="seller-rating">
          {hasRating
            ? t('detail.ratingValue', {
                average: sellerRating.average?.toLocaleString(locale === 'ar' ? 'ar' : 'en-US'),
                count: sellerRating.count,
              })
            : t('detail.noReviews')}
        </span>
      </div>
    </DetailSection>
  );
}
