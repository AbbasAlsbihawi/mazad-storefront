'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui';
import { getErrorCode } from '@shared/lib';
import { useMoney } from '@shared/hooks';
import { useBuyNow } from '../hooks/useBuyNow';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';

export interface BuyNowButtonProps {
  auctionId: string;
  buyNowPrice: string;
}

export function BuyNowButton({ auctionId, buyNowPrice }: BuyNowButtonProps) {
  const { t } = useBiddingTranslation();
  const { t: tCommon } = useTranslation('common');
  const { money } = useMoney();
  const buyNow = useBuyNow(auctionId);
  const errorCode = getErrorCode(buyNow.error);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="gray" isLoading={buyNow.isPending} onClick={() => buyNow.mutate()}>
        {t('form.buyNow', { amount: money(buyNowPrice) })}
      </Button>
      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
    </div>
  );
}
