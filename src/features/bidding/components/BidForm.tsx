'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'node_modules/react-i18next';
import { Button, Input } from '@shared/components/ui';
import { getErrorCode, formatMoney } from '@shared/lib';
import { ROUTES } from '@shared/constants';
import { placeBidFormSchema } from '../schemas/bidding.schema';
import { computeMinimumBid } from '../lib/computeMinimumBid';
import { usePlaceBid } from '../hooks/usePlaceBid';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import type { AuctionPricing, PlaceBidFormValues } from '../types/bidding.types';

export interface BidFormProps {
  auction: AuctionPricing;
}

export function BidForm({ auction }: BidFormProps) {
  const { t } = useBiddingTranslation();
  const { t: tCommon } = useTranslation('common');
  const placeBid = usePlaceBid(auction.id);
  const minimumBid = computeMinimumBid(auction);
  const [belowMinimum, setBelowMinimum] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaceBidFormValues>({ resolver: zodResolver(placeBidFormSchema) });

  const errorCode = getErrorCode(placeBid.error);

  const onSubmit = handleSubmit((values) => {
    if (minimumBid != null && values.amount < minimumBid) {
      setBelowMinimum(minimumBid);
      return;
    }
    setBelowMinimum(null);
    placeBid.mutate(values.amount, { onSuccess: () => reset() });
  });

  const amountError = errors.amount
    ? t(errors.amount.message ?? '')
    : belowMinimum != null
      ? t('errors.field.belowMinimum', { amount: formatMoney(String(belowMinimum)) })
      : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <Input
        label={
          minimumBid != null
            ? t('form.amountWithMinimum', { amount: formatMoney(String(minimumBid)) })
            : t('form.amount')
        }
        type="number"
        step="0.01"
        min={minimumBid ?? 0}
        error={amountError}
        {...register('amount', { valueAsNumber: true })}
      />
      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {errorCode === 'ADDRESS_REQUIRED' ? (
            <>
              {t('errors.ADDRESS_REQUIRED')}{' '}
              <Link href={ROUTES.addressesList} className="underline">
                {t('errors.addAddressLink')}
              </Link>
            </>
          ) : (
            t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })
          )}
        </p>
      ) : null}
      <Button type="submit" isLoading={placeBid.isPending}>
        {t('form.placeBid')}
      </Button>
    </form>
  );
}
