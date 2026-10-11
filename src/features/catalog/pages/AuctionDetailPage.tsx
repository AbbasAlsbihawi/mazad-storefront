'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { EmptyState, PageLoader, ErrorState } from '@shared/components/feedback';
import { Icon, IconButton, SectionHeader, buttonVariants } from '@shared/components/ui';
import { AuctionRail } from '@shared/components/cards';
import { useLocale, useToast } from '@shared/hooks';
import {
  getErrorCode,
  getErrorStatus,
  getImageTintStyle,
  pickLocalizedName,
  resolveAssetUrl,
  shareLink,
} from '@shared/lib';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { useAuction } from '../hooks/useAuction';
import { useAuctionBids } from '../hooks/useAuctionBids';
import { useSimilarAuctions } from '../hooks/useSimilarAuctions';
import { AuctionInfoSection } from '../components/AuctionInfoSection';
import { AuctionPriceSection } from '../components/AuctionPriceSection';
import { BidHistorySection } from '../components/BidHistorySection';
import { DeliveryPaymentSection, ReturnPolicySection } from '../components/DeliveryPaymentSection';
import { DetailGallery } from '../components/DetailGallery';
import { ProductDetailsSection, ProductInfoSection } from '../components/ProductSections';
import { SellerCard } from '../components/SellerCard';

export interface AuctionDetailPageProps {
  id: string;
  /**
   * The bid panel, given the auction's seller (a seller can't bid on their own auction) and status
   * (a closed auction may have been won by the viewer).
   */
  renderBiddingPanel?: (auction: { sellerId: string; status: string }) => ReactNode;
  watchlistToggle?: ReactNode;
  renderSellerFollowToggle?: (sellerId: string) => ReactNode;
}

/**
 * The auction page, most important first: photos, title, prices, status and countdown, the
 * viewer's state with what they can do, then delivery and payment, the product's description and
 * details, the seller, the bids and the return policy — stacked sections, nothing behind tabs.
 */
export function AuctionDetailPage({
  id,
  renderBiddingPanel,
  watchlistToggle,
  renderSellerFollowToggle,
}: AuctionDetailPageProps) {
  const { t, isReady } = useCatalogTranslation();
  const { t: tCommon } = useTranslation('common');
  const { locale } = useLocale();

  const auction = useAuction(id);
  const bids = useAuctionBids(id, auction.data?.status === 'LIVE');
  const similar = useSimilarAuctions(id);

  if (!isReady || auction.isPending) return <PageLoader />;
  if (auction.isError || !auction.data) {
    // A definite 404 won't change on retry: offer a way on instead. Retry stays for network and
    // server failures, which can.
    const isNotFound =
      getErrorCode(auction.error) === 'AUCTION_NOT_FOUND' || getErrorStatus(auction.error) === 404;
    if (isNotFound) {
      return (
        <EmptyState
          icon="search"
          title={t('detail.notFound')}
          message={t('detail.notFoundMessage')}
          action={
            <Link
              href={ROUTES.auctions}
              className={`mt-2 ${buttonVariants({ variant: 'tinted' })}`}
            >
              {t('detail.browseAuctions')}
            </Link>
          }
        />
      );
    }
    return <ErrorState message={t('detail.loadError')} onRetry={() => void auction.refetch()} />;
  }

  const data = auction.data;
  // The reading language's name, else the other one's: never blank.
  const name = pickLocalizedName(data.product, locale);
  const coverImage = resolveAssetUrl(data.product.coverImage);
  const photos = data.product.gallery;

  return (
    // Clears the pinned bottom action bar the bidding panel renders.
    <div className="pb-28">
      {/* Image well — full-bleed pastel tint with the glass controls floating over it. Tall enough
          for the photo to be the first thing a buyer studies, with the thumbnails clear of the
          arrows. */}
      <div
        className="relative h-80 w-full md:h-[28rem]"
        style={coverImage ? undefined : getImageTintStyle(data.product.id)}
      >
        {photos.length > 0 ? (
          <DetailGallery images={photos} name={name} />
        ) : coverImage ? (
          <Image src={coverImage} alt={name} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-foreground/22">
            <Icon name="package" size={92} />
          </span>
        )}

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <BackButton label={tCommon('nav.back')} />
          <div className="flex items-center gap-2">
            <ShareButton
              label={t('detail.share')}
              copiedMessage={t('detail.linkCopied')}
              failedMessage={t('detail.shareUnavailable')}
            />
            {watchlistToggle}
          </div>
        </div>
      </div>

      {/* Content sheet — lifted over the image well with 28pt top corners. */}
      <div className="relative -mt-6 rounded-t-[28px] bg-background px-gutter pt-5">
        <h1 className="text-title-2 font-extrabold text-foreground">{name}</h1>

        <AuctionPriceSection auction={data} />
        <AuctionInfoSection auction={data} />

        {renderBiddingPanel ? (
          <div className="mt-4">
            {renderBiddingPanel({ sellerId: data.seller.id, status: data.status })}
          </div>
        ) : null}

        <DeliveryPaymentSection auction={data} />
        <ProductDetailsSection auction={data} />
        <ProductInfoSection auction={data} />
        <SellerCard auction={data} followToggle={renderSellerFollowToggle?.(data.seller.id)} />
        <BidHistorySection bids={bids.data} />
        <ReturnPolicySection auction={data} />

        {similar.data && similar.data.length > 0 ? (
          <section className="mt-6">
            <SectionHeader title={t('detail.similar')} />
            <AuctionRail auctions={similar.data} />
          </section>
        ) : null}
      </div>
    </div>
  );
}

function BackButton({ label }: { label: string }) {
  return (
    <IconButton
      name="chevron-left"
      className="rtl:[&>svg]:-scale-x-100"
      label={label}
      tone="glass"
      onClick={() => window.history.back()}
    />
  );
}

function ShareButton({
  label,
  copiedMessage,
  failedMessage,
}: {
  label: string;
  copiedMessage: string;
  failedMessage: string;
}) {
  const toast = useToast();
  const handleShare = async () => {
    const outcome = await shareLink(window.location.href);
    if (outcome === 'copied') toast.success(copiedMessage);
    if (outcome === 'unavailable') toast.error(failedMessage);
  };

  return (
    <IconButton name="share-2" label={label} tone="glass" onClick={() => void handleShare()} />
  );
}
