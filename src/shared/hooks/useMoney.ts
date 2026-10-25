'use client';

import { useCallback } from 'react';
import { formatMoney, formatMoneyParts, formatNumber, formatRating } from '@shared/lib';
import { useLocaleStore } from '@shared/store';

/**
 * Binds the money/number formatters to the active locale so a component never has to thread it
 * through. Subscribes to the store directly rather than through useLocale(), which also owns the
 * `<html lang/dir>` side effect and shouldn't run once per formatted price.
 */
export function useMoney() {
  const locale = useLocaleStore((state) => state.locale);

  return {
    money: useCallback((value: string | null | undefined) => formatMoney(value, locale), [locale]),
    moneyParts: useCallback(
      (value: string | null | undefined) => formatMoneyParts(value, locale),
      [locale],
    ),
    number: useCallback(
      (value: number | null | undefined) => formatNumber(value, locale),
      [locale],
    ),
    rating: useCallback(
      (value: number | null | undefined) => formatRating(value, locale),
      [locale],
    ),
  };
}
