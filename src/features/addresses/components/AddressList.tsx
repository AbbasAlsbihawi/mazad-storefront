'use client';

import { EmptyState } from '@shared/components/feedback';
import { AddressCard } from './AddressCard';
import { useAddressesTranslation } from '../hooks/useAddressesTranslation';
import type { Address } from '../types/addresses.types';

export interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const { t } = useAddressesTranslation();

  if (addresses.length === 0) {
    return <EmptyState message={t('list.empty')} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
}
