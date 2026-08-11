import type { Locale } from '@shared/store';

const CURRENCY_LABEL: Record<Locale, string> = { ar: 'د.ع', en: 'IQD' };

// A string rather than an array so indexing is total — charAt never widens to `undefined` the
// way an element access does under noUncheckedIndexedAccess.
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * mazad-api serializes every price as a Decimal string (e.g. "1250.00"), never a JSON number
 * (see ADR-009). This is the only place that parses one.
 */
export function parseMoney(value: string | null | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Western numerals → Arabic-Indic. Every *quantity* the user reads in Arabic goes through this:
 * prices, bid counts, ratings, item counts. Countdowns deliberately don't — they stay Western
 * with tabular-nums so the digits don't jitter width while ticking (design system, "Money and
 * time").
 */
export function toArabicDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS.charAt(Number(digit)));
}

/** Localizes a bare number — bid counts, follower counts — without a currency suffix. */
export function formatNumber(value: number | null | undefined, locale: Locale): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const grouped = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  return locale === 'ar' ? toArabicDigits(grouped) : grouped;
}

/**
 * Iraqi Dinar has no minor unit, so amounts never show decimals. Grouping is always the Western
 * comma (`١٢٥,٠٠٠ د.ع`) rather than Intl's `ar` group separator — that's what the design system
 * specifies, and it keeps the separator identical across both locales.
 */
export function formatMoney(value: string | null | undefined, locale: Locale): string {
  const amount = parseMoney(value);
  if (amount == null) return '—';
  const grouped = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  const digits = locale === 'ar' ? toArabicDigits(grouped) : grouped;
  return `${digits} ${CURRENCY_LABEL[locale]}`;
}
