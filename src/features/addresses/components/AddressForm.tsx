'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@shared/components/ui';
import { getErrorCode } from '@shared/lib';
import { addressFormSchema } from '../schemas/addresses.schema';
import { useCreateAddress } from '../hooks/useCreateAddress';
import { useUpdateAddress } from '../hooks/useUpdateAddress';
import { useAddressesTranslation } from '../hooks/useAddressesTranslation';
import type { Address, AddressFormValues } from '../types/addresses.types';

export interface AddressFormProps {
  address?: Address;
  onDone: () => void;
}

export function AddressForm({ address, onDone }: AddressFormProps) {
  const { t } = useAddressesTranslation();
  const { t: tCommon } = useTranslation('common');
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: address
      ? {
          label: address.label,
          city: address.city,
          area: address.area ?? undefined,
          street: address.street ?? undefined,
          details: address.details ?? undefined,
          contactPhone: address.contactPhone ?? undefined,
          isDefault: address.isDefault,
        }
      : undefined,
  });

  const mutation = address ? updateAddress : createAddress;
  const errorCode = getErrorCode(mutation.error);

  const onSubmit = handleSubmit((values) => {
    if (address) {
      updateAddress.mutate({ id: address.id, values }, { onSuccess: onDone });
    } else {
      createAddress.mutate(values, { onSuccess: onDone });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Input
        label={t('fields.label')}
        error={errors.label ? t(errors.label.message ?? '') : undefined}
        {...register('label')}
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
      <label className="flex items-center gap-2 text-sm text-foreground-soft">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          {...register('isDefault')}
        />
        {t('fields.isDefault')}
      </label>

      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" isLoading={mutation.isPending}>
          {t(address ? 'form.save' : 'form.add')}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}
