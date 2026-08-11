'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@shared/components/ui';
import { getErrorCode } from '@shared/lib';
import { registerSchema } from '../schemas/auth.schema';
import type { RegisterValues } from '../types/auth.types';
import { useRegister } from '../hooks/useRegister';
import { useAuthTranslation } from '../hooks/useAuthTranslation';

export function RegisterForm() {
  const { t } = useAuthTranslation();
  const { t: tCommon } = useTranslation('common');
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((values) => registerMutation.mutate(values));
  const errorCode = getErrorCode(registerMutation.error);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label={t('fields.fullName')}
        type="text"
        autoComplete="name"
        error={errors.fullName ? t(errors.fullName.message ?? '') : undefined}
        {...register('fullName')}
      />
      <Input
        label={t('fields.phone')}
        type="tel"
        autoComplete="tel"
        placeholder={t('fields.phonePlaceholder')}
        error={errors.phone ? t(errors.phone.message ?? '') : undefined}
        {...register('phone')}
      />
      <Input
        label={t('fields.password')}
        type="password"
        autoComplete="new-password"
        error={errors.password ? t(errors.password.message ?? '') : undefined}
        {...register('password')}
      />
      {errorCode ? (
        <p role="alert" className="text-sm text-destructive">
          {tCommon(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
      <Button type="submit" isLoading={registerMutation.isPending}>
        {t('register.submit')}
      </Button>
    </form>
  );
}
