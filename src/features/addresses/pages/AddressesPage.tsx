'use client';

import { useState } from 'react';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { Button, Card, CardContent } from '@shared/components/ui';
import { useAddresses } from '../hooks/useAddresses';
import { useAddressesTranslation } from '../hooks/useAddressesTranslation';
import { AddressList } from '../components/AddressList';
import { AddressForm } from '../components/AddressForm';

export function AddressesPage() {
  const { t, isReady } = useAddressesTranslation();
  const { data: addresses, isPending, isError, refetch } = useAddresses();
  const [isAdding, setIsAdding] = useState(false);

  if (!isReady || isPending) return <PageLoader />;
  if (isError || !addresses) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">{t('page.title')}</h1>
      <p className="text-sm text-foreground-soft">{t('page.subtitle')}</p>

      <AddressList addresses={addresses} />

      {isAdding ? (
        <Card>
          <CardContent>
            <AddressForm onDone={() => setIsAdding(false)} />
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)}>
          {t('page.addNew')}
        </Button>
      )}
    </div>
  );
}
