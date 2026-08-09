'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { useIsAuthenticated } from '@shared/hooks';
import { useAuctionPricing } from '../hooks/useAuctionPricing';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import { BidForm } from './BidForm';
import { BuyNowButton } from './BuyNowButton';
import { AutoBidControl } from './AutoBidControl';

export interface BidPanelProps {
  auctionId: string;
}

export function BidPanel({ auctionId }: BidPanelProps) {
  const { t, isReady } = useBiddingTranslation();
  const isAuthenticated = useIsAuthenticated();
  const pricing = useAuctionPricing(auctionId);

  if (!isReady || pricing.isPending) return <PageLoader />;
  if (pricing.isError || !pricing.data) {
    return <ErrorState message={t('panel.loadError')} onRetry={() => void pricing.refetch()} />;
  }

  if (pricing.data.status !== 'LIVE') {
    return <p className="text-sm text-muted-foreground">{t('panel.notLive')}</p>;
  }

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href={ROUTES.login} className="text-accent hover:underline">
          {t('panel.signInToBid')}
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <BidForm auction={pricing.data} />
      {pricing.data.buyNowPrice ? (
        <BuyNowButton auctionId={auctionId} buyNowPrice={pricing.data.buyNowPrice} />
      ) : null}
      <AutoBidControl auctionId={auctionId} />
    </div>
  );
}
