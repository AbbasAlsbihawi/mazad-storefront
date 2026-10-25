const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';

/** Western digits, without the grouping a seller may type (commas, Arabic separator, spaces). */
function normalizeDinars(text: string): string {
  return text
    .trim()
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_INDIC.indexOf(digit)))
    .replace(/[,٬\s]/g, '');
}

/** A typed amount (grouping commas, Arabic digits allowed) as whole dinars, or an error key. */
export function parseDinars(text: string): { value: number } | { error: string } {
  const normalized = normalizeDinars(text);
  if (!normalized) return { error: 'empty' };
  if (/^\d+[.٫]\d*[1-9]\d*$/.test(normalized)) return { error: 'errors.field.wholeDinars' };
  const whole = normalized.replace(/[.٫]0*$/, '');
  if (!/^\d+$/.test(whole)) return { error: 'invalid' };
  const value = Number(whole);
  return Number.isSafeInteger(value) ? { value } : { error: 'invalid' };
}

/**
 * The field's text with thousands grouped as the seller types ("1250000" → "1,250,000"). Anything
 * that isn't a plain whole number (decimals, letters) stays exactly as typed, so the validation
 * message can explain it.
 */
export function groupDinars(text: string): string {
  const normalized = normalizeDinars(text);
  if (!/^\d+$/.test(normalized)) return text;
  return normalized.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
