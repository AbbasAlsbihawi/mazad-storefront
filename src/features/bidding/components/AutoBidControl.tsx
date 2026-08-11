'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@shared/components/ui';
import { getErrorCode } from '@shared/lib';
import { autoBidFormSchema } from '../schemas/bidding.schema';
import { useSetAutoBid } from '../hooks/useSetAutoBid';
import { useCancelAutoBid } from '../hooks/useCancelAutoBid';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import type { AutoBidFormValues } from '../types/bidding.types';

export interface AutoBidControlProps {
  auctionId: string;
}

// mazad-api has no GET for "my current auto-bid on this auction" — state here reflects only
// this session's own mutation responses and resets on reload (documented v1 limitation, see the
// interactive-features plan).
export function AutoBidControl({ auctionId }: AutoBidControlProps) {
  const { t } = useBiddingTranslation();
  const { t: tCommon } = useTranslation('common');
  const [active, setActive] = useState<{ maxAmount: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const setAutoBid = useSetAutoBid(auctionId);
  const cancelAutoBid = useCancelAutoBid(auctionId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AutoBidFormValues>({ resolver: zodResolver(autoBidFormSchema) });

  const errorCode = getErrorCode(setAutoBid.error) ?? getErrorCode(cancelAutoBid.error);

  const onSubmit = handleSubmit((values) => {
    setAutoBid.mutate(values.maxAmount, {
      onSuccess: (result) => {
        setActive({ maxAmount: result.maxAmount });
        setIsExpanded(false);
      },
    });
  });

  if (active) {
    return (
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-foreground-soft">
          {t('autoBid.active', { amount: active.maxAmount })}
        </span>
        <Button
          variant="plain"
          size="sm"
          isLoading={cancelAutoBid.isPending}
          onClick={() => cancelAutoBid.mutate(undefined, { onSuccess: () => setActive(null) })}
        >
          {t('autoBid.cancel')}
        </Button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <Button variant="plain" size="sm" onClick={() => setIsExpanded(true)}>
        {t('autoBid.setUp')}
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <Input
        label={t('autoBid.maxAmount')}
        type="number"
        step="0.01"
        error={errors.maxAmount ? t(errors.maxAmount.message ?? '') : undefined}
        {...register('maxAmount', { valueAsNumber: true })}
      />
      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={setAutoBid.isPending}>
          {t('autoBid.submit')}
        </Button>
        <Button type="button" variant="plain" size="sm" onClick={() => setIsExpanded(false)}>
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}
