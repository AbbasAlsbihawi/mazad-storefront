import type { Locale } from '@shared/store';

const CURRENCY_LABEL: Record<Locale, string> = { ar: 'د.ع', en: 'IQD' };

/**
 * mazad-api serializes every price as a Decimal string (e.g. "1250.00"), never a JSON number
 * (see ADR-009). This is the only place that parses one.
 */
export function parseMoney(value: string | null | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** mazad-api's Decimal(12, 2) ceiling; larger amounts are refused there. */
export const MAX_MONEY_AMOUNT = 9_999_999_999.99;

/**
 * Money arithmetic happens in integer minor units (hundredths, matching the API's Decimal(12, 2)),
 * never in binary floating point: the largest amount is 999,999,999,999 minor units, well inside
 * Number's exact-integer range. A Decimal string is parsed digit by digit; a number (a Stepper
 * value, an input) is first rounded to 2 decimals, which also absorbs float noise like 0.1 + 0.2.
 */
export function toMinorUnits(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const text =
    typeof value === 'number' ? (Number.isFinite(value) ? value.toFixed(2) : '') : value.trim();
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) return null;
  const [, sign, whole, fraction = ''] = match;
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(minor)) return null;
  return sign === '-' ? -minor : minor;
}

/** Minor units back to the amount the API takes (`{ amount: 1260.5 }` serializes exactly). */
export function fromMinorUnits(minor: number): number {
  return minor / 100;
}

/** Snaps a computed amount (e.g. value ± step) to exact 2-decimal money. */
export function roundMoney(value: number): number {
  const minor = toMinorUnits(value);
  return minor == null ? value : fromMinorUnits(minor);
}

/**
 * Bidoom reads numbers in Western digits in Arabic too (the design's NUMS = 'latn'): prices,
 * counts, ratings, order numbers and countdowns all match the product names, codes and phone
 * numbers around them. Arabic formats through ar-IQ with the latn numbering system, which keeps
 * the Western comma for grouping.
 */
export function numberLocale(locale: string | undefined): string {
  return locale === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-US';
}

/** The currency label after an amount: د.ع in Arabic, IQD in English. */
export function currencyLabel(locale: Locale): string {
  return CURRENCY_LABEL[locale];
}

/**
 * `{{count, num}}` inside translations (registered as the i18next `num` formatter): a quantity
 * embedded in a sentence gets the same grouping as formatNumber. Keeps up to two decimals
 * (ratings) and passes non-numbers through unchanged.
 */
export function formatQuantity(value: unknown, locale: string | undefined): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 2 }).format(value);
  }
  return String(value ?? '');
}

/** Localizes a bare number (bid counts, follower counts) without a currency suffix. */
export function formatNumber(value: number | null | undefined, locale: Locale): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }).format(value);
}

/** A star rating to one decimal: 4.8. */
export function formatRating(value: number | null | undefined, locale: Locale): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * The amount and its currency label separately, for the price display that sets the label
 * smaller and muted (`1,325,000` + `د.ع`). The Iraqi Dinar has no minor unit: no decimals.
 */
export function formatMoneyParts(
  value: string | null | undefined,
  locale: Locale,
): { amount: string; currency: string } | null {
  const amount = parseMoney(value);
  if (amount == null) return null;
  return {
    amount: new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }).format(
      amount,
    ),
    currency: CURRENCY_LABEL[locale],
  };
}

/** `1,325,000 د.ع` / `1,325,000 IQD`: the plain-text price, for labels and sentences. */
export function formatMoney(value: string | null | undefined, locale: Locale): string {
  const parts = formatMoneyParts(value, locale);
  return parts ? `${parts.amount} ${parts.currency}` : '—';
}
