'use client';

import { Icon } from '@shared/components/ui';
import { auctionPrices } from '../lib/auction-prices';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { Auction } from '../types/catalog.types';
import { DeliveryFeeRow } from './AuctionPriceSection';
import { DetailSection } from './DetailSection';

/** mazad-api's default return window, for builds that don't send returnWindowDays. */
const DEFAULT_RETURN_DAYS = 7;

/**
 * The delivery fee and the ways to pay: cash on delivery always, card when mazad-api offers it.
 * Paying is chosen after winning, when the order is confirmed. No provider or test-mode details.
 */
export function DeliveryPaymentSection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  const { deliveryFee, isDeliveryFree } = auctionPrices(auction);
  const acceptsCard = auction.paymentMethods?.includes('CARD') ?? false;

  return (
    <DetailSection title={t('detail.deliveryPayment')} testId="detail-delivery-payment">
      <DeliveryFeeRow fee={deliveryFee} isFree={isDeliveryFree} />
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground">{t('detail.paymentMethods')}</span>
        <ul className="flex flex-col gap-1" data-testid="detail-payment-methods">
          <PaymentMethod label={t('detail.paymentCod')} />
          {acceptsCard ? <PaymentMethod label={t('detail.paymentCard')} /> : null}
        </ul>
        <span className="text-footnote text-muted-foreground">{t('detail.paymentHint')}</span>
      </div>
    </DetailSection>
  );
}

function PaymentMethod({ label }: { label: string }) {
  return (
    <li className="inline-flex items-center gap-2 font-medium text-foreground">
      <Icon name="check" size={16} className="shrink-0 text-success" />
      {label}
    </li>
  );
}

/** How long after delivery a return can be requested (mazad-api's window), and how. */
export function ReturnPolicySection({ auction }: { auction: Auction }) {
  const { t } = useCatalogTranslation();
  return (
    <DetailSection title={t('detail.returnPolicy')} testId="detail-returns">
      <p className="text-foreground">
        {t('detail.returnsWithin', { count: auction.returnWindowDays ?? DEFAULT_RETURN_DAYS })}
      </p>
      <span className="text-footnote text-muted-foreground">{t('detail.returnsHint')}</span>
    </DetailSection>
  );
}
