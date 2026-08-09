import { describe, it, expect } from 'vitest';
import { formatMoney, parseMoney } from './money';

describe('parseMoney', () => {
  it('parses a decimal string', () => {
    expect(parseMoney('1250.00')).toBe(1250);
  });

  it('returns null for null or undefined', () => {
    expect(parseMoney(null)).toBeNull();
    expect(parseMoney(undefined)).toBeNull();
  });

  it('returns null for a non-numeric string', () => {
    expect(parseMoney('not-a-number')).toBeNull();
  });
});

describe('formatMoney', () => {
  it('formats with thousands separators and the IQD suffix', () => {
    expect(formatMoney('1250000')).toBe('1,250,000 IQD');
  });

  it('renders an em dash when there is no price', () => {
    expect(formatMoney(null)).toBe('—');
  });
});
