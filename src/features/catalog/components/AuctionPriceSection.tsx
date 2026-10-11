'use client';

import { useMoney } from '@shared/hooks';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import { auctionPrices } from '../lib/auction-prices';
import type { Auction } from '../types/catalog.types';
import { DetailRow } from './DetailSection';

/**
 * The prices, each under its own label and only when it exists: the main price (current, opening
 * or sold for), the opening bid once there are bids, buy now with its total including delivery
 * (the only total shown: a live bid is not final), the seller's new retail price, the next raise
 * and the delivery fee.
 */
export function AuctionPriceSection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  const { money } = useMoney();
  const prices = auctionPrices(auction);

  return (
    <div className="mt-4 flex flex-col gap-3" data-testid="detail-prices">
      <div className="min-w-0">
        <p className="text-caption text-muted-foreground">
          {prices.main.kind === 'sold' ? t('detail.soldFor') : t(`price.${prices.main.kind}`)}
        </p>
        {/* Prices are bold near-black, never the accent. */}
        <p
          className="text-large-title font-extrabold text-foreground tabular-nums"
          data-testid="detail-main-price"
        >
          {money(prices.main.amount)}
        </p>
        {prices.saving ? <SavingNote amount={money(prices.saving)} /> : null}
      </div>

      <div className="flex flex-col gap-1.5 text-subhead">
        {prices.opening ? (
          <DetailRow label={t('price.opening')} value={money(prices.opening)} />
        ) : null}
        {prices.buyNow ? (
          <>
            <DetailRow
              label={t('price.buyNow')}
              value={money(prices.buyNow.amount)}
              testId="price-buy-now"
            />
            {prices.buyNow.saving ? <SavingNote amount={money(prices.buyNow.saving)} /> : null}
            <DetailRow
              label={t('price.buyNowTotal')}
              value={money(prices.buyNow.totalWithDelivery)}
              isStrong
              testId="price-buy-now-total"
            />
          </>
        ) : null}
        {prices.marketPrice ? (
          <div className="flex flex-col gap-0.5">
            <DetailRow
              label={t('price.marketPrice')}
              value={money(prices.marketPrice)}
              testId="price-market"
            />
            <span className="text-caption text-muted-foreground">{t('price.marketPriceHint')}</span>
          </div>
        ) : null}
        {prices.nextRaise ? (
          <DetailRow label={t('price.nextRaise')} value={money(prices.nextRaise)} />
        ) : null}
        <DeliveryFeeRow fee={prices.deliveryFee} isFree={prices.isDeliveryFree} />
      </div>
    </div>
  );
}

/** "Delivery: 5,000 IQD", or "No delivery fee" (never "free shipping"). */
export function DeliveryFeeRow({ fee, isFree }: { fee: string; isFree: boolean }) {
  const { t } = useCatalogTranslation();
  const { money } = useMoney();
  return (
    <DetailRow
      label={t('price.delivery')}
      value={isFree ? t('price.noDeliveryFee') : money(fee)}
      testId="price-delivery"
    />
  );
}

/** Small and muted, never louder than the price it explains. */
function SavingNote({ amount }: { amount: string }) {
  const { t } = useCatalogTranslation();
  return (
    <p className="text-caption text-muted-foreground" data-testid="price-saving">
      {t('price.saving', { amount })}
    </p>
  );
}
