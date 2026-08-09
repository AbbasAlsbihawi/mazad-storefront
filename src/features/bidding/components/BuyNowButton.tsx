'use client';

import { useTranslation } from 'node_modules/react-i18next';
import { Button } from '@shared/components/ui';
import { getErrorCode, formatMoney } from '@shared/lib';
import { useBuyNow } from '../hooks/useBuyNow';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';

export interface BuyNowButtonProps {
  auctionId: string;
  buyNowPrice: string;
}

export function BuyNowButton({ auctionId, buyNowPrice }: BuyNowButtonProps) {
  const { t } = useBiddingTranslation();
  const { t: tCommon } = useTranslation('common');
  const buyNow = useBuyNow(auctionId);
  const errorCode = getErrorCode(buyNow.error);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" isLoading={buyNow.isPending} onClick={() => buyNow.mutate()}>
        {t('form.buyNow', { amount: formatMoney(buyNowPrice) })}
      </Button>
      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
    </div>
  );
}
