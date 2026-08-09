const CURRENCY_LABEL = 'IQD';

/**
 * mazad-api serializes every price as a Decimal string (e.g. "1250.00"), never a JSON number
 * (see ADR-009). This is the only place that parses one.
 */
export function parseMoney(value: string | null | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Digits stay Western numerals in both locales; only surrounding copy is translated. */
export function formatMoney(value: string | null | undefined): string {
  const amount = parseMoney(value);
  if (amount == null) return '—';
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  return `${formatted} ${CURRENCY_LABEL}`;
}
