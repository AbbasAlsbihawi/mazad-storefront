'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@shared/components/ui';
import { getErrorCode } from '@shared/lib';
import { storeFormSchema } from '../schemas/selling.schema';
import { useCreateStore, useUpdateStore } from '../hooks/useStores';
import { useSellingTranslation } from '../hooks/useSellingTranslation';
import type { Store, StoreFormInput, StoreFormValues } from '../types/selling.types';

export interface StoreFormProps {
  store?: Store;
  onDone: () => void;
}

export function StoreForm({ store, onDone }: StoreFormProps) {
  const { t } = useSellingTranslation();
  const { t: tCommon } = useTranslation('common');
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreFormInput, unknown, StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: store
      ? {
          nameEn: store.nameEn,
          nameAr: store.nameAr,
          city: store.city,
          area: store.area ?? undefined,
          street: store.street ?? undefined,
          details: store.details ?? undefined,
          contactPhone: store.contactPhone ?? undefined,
          deliveryFee: Number(store.deliveryFee),
        }
      : { deliveryFee: 0 },
  });

  const mutation = store ? updateStore : createStore;
  const errorCode = getErrorCode(mutation.error);

  const onSubmit = handleSubmit((values) => {
    if (store) {
      updateStore.mutate({ id: store.id, values }, { onSuccess: onDone });
    } else {
      createStore.mutate(values, { onSuccess: onDone });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Input
        label={t('fields.nameAr')}
        error={errors.nameAr ? t(errors.nameAr.message ?? '') : undefined}
        {...register('nameAr')}
      />
      <Input
        label={t('fields.nameEn')}
        error={errors.nameEn ? t(errors.nameEn.message ?? '') : undefined}
        {...register('nameEn')}
      />
      <Input
        label={t('fields.city')}
        error={errors.city ? t(errors.city.message ?? '') : undefined}
        {...register('city')}
      />
      <Input label={t('fields.area')} {...register('area')} />
      <Input label={t('fields.street')} {...register('street')} />
      <Input label={t('fields.details')} {...register('details')} />
      <Input label={t('fields.contactPhone')} type="tel" {...register('contactPhone')} />
      <Input
        label={t('fields.deliveryFee')}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        error={errors.deliveryFee ? t(errors.deliveryFee.message ?? '') : undefined}
        {...register('deliveryFee')}
      />

      {errorCode ? (
        <p role="alert" className="text-footnote text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" isLoading={mutation.isPending}>
          {t(store ? 'form.save' : 'form.create')}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}
