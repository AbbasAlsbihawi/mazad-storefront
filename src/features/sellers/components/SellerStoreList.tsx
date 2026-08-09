'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { useLocale } from '@shared/hooks';
import { pickLocalizedName } from '@shared/lib';
import type { SellerProfile } from '../types/sellers.types';

export interface SellerStoreListProps {
  stores: SellerProfile['stores'];
}

export function SellerStoreList({ stores }: SellerStoreListProps) {
  const { locale } = useLocale();

  return (
    <ul className="flex flex-col gap-2">
      {stores.map((store) => (
        <li key={store.id}>
          <Link
            href={ROUTES.store(store.id)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {pickLocalizedName(store, locale)}
          </Link>
          <span className="text-sm text-muted-foreground"> — {store.city}</span>
        </li>
      ))}
    </ul>
  );
}
