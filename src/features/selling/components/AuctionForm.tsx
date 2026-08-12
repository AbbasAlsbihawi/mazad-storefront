'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@shared/components/ui';
import { getErrorCode, pickLocalizedName } from '@shared/lib';
import { useLocale } from '@shared/hooks';
import { auctionFormSchema } from '../schemas/selling.schema';
import { useCreateAuction, useUpdateAuction } from '../hooks/useSellerAuctions';
import { useSellingTranslation } from '../hooks/useSellingTranslation';
import { fromDateTimeInputValue, toDateTimeInputValue } from '../lib/datetime-input';
import type {
  AuctionFormInput,
  AuctionFormValues,
  SellerAuction,
  SellerProduct,
} from '../types/selling.types';

export interface AuctionFormProps {
  auction?: SellerAuction;
  products: SellerProduct[];
  /** Preselects the product when arriving from a product's "put up for auction". */
  initialProductId?: string;
  onDone: (auction: SellerAuction) => void;
  onCancel: () => void;
}

export function AuctionForm({
  auction,
  products,
  initialProductId,
  onDone,
  onCancel,
}: AuctionFormProps) {
  const { t } = useSellingTranslation();
  const { t: tCommon } = useTranslation('common');
  const { locale } = useLocale();
  const createAuction = useCreateAuction();
  const updateAuction = useUpdateAuction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormInput, unknown, AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: auction
      ? {
          productId: auction.product?.id ?? '',
          startingPrice: Number(auction.startingPrice),
          minIncrement: Number(auction.minIncrement),
          startsAt: toDateTimeInputValue(auction.startsAt),
          endsAt: toDateTimeInputValue(auction.endsAt),
          buyNowPrice: auction.buyNowPrice ? Number(auction.buyNowPrice) : undefined,
        }
      : { productId: initialProductId ?? '' },
  });

  const mutation = auction ? updateAuction : createAuction;
  const errorCode = getErrorCode(mutation.error);

  const onSubmit = handleSubmit((values) => {
    // The form holds local wall-clock strings; the API wants instants.
    const payload: AuctionFormValues = {
      ...values,
      startsAt: fromDateTimeInputValue(values.startsAt),
      endsAt: fromDateTimeInputValue(values.endsAt),
    };

    if (auction) {
      updateAuction.mutate({ id: auction.id, values: payload }, { onSuccess: onDone });
    } else {
      createAuction.mutate(payload, { onSuccess: onDone });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Select
        label={t('fields.product')}
        placeholder={t('form.selectProduct')}
        options={products.map((product) => ({
          value: product.id,
          label: pickLocalizedName(product, locale),
        }))}
        // The product is fixed once the auction exists — UpdateAuctionDto carries only pricing
        // and dates.
        disabled={Boolean(auction)}
        error={errors.productId ? t(errors.productId.message ?? '') : undefined}
        {...register('productId')}
      />

      <Input
        label={t('fields.startingPrice')}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        error={errors.startingPrice ? t(errors.startingPrice.message ?? '') : undefined}
        {...register('startingPrice')}
      />
      <Input
        label={t('fields.minIncrement')}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0.01"
        error={errors.minIncrement ? t(errors.minIncrement.message ?? '') : undefined}
        {...register('minIncrement')}
      />

      <Input
        label={t('fields.startsAt')}
        type="datetime-local"
        error={errors.startsAt ? t(errors.startsAt.message ?? '') : undefined}
        {...register('startsAt')}
      />
      <Input
        label={t('fields.endsAt')}
        type="datetime-local"
        error={errors.endsAt ? t(errors.endsAt.message ?? '') : undefined}
        {...register('endsAt')}
      />

      <Input
        label={t('fields.buyNowPrice')}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        hint={t('fields.buyNowHint')}
        {...register('buyNowPrice')}
      />

      {errorCode ? (
        <p role="alert" className="text-footnote text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" isLoading={mutation.isPending}>
          {t(auction ? 'form.save' : 'form.create')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}
