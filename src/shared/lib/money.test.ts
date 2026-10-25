import { describe, it, expect } from 'vitest';
import {
  formatMoney,
  formatMoneyParts,
  formatNumber,
  formatQuantity,
  formatRating,
  parseMoney,
} from './money';

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
  it('formats English with Western digits and the IQD suffix', () => {
    expect(formatMoney('1250000', 'en')).toBe('1,250,000 IQD');
  });

  it('formats Arabic with Western digits (ar-IQ, latn) and the د.ع suffix', () => {
    expect(formatMoney('125000', 'ar')).toBe('125,000 د.ع');
  });

  it('drops the fractional part — the dinar has no minor unit', () => {
    expect(formatMoney('1250.75', 'en')).toBe('1,251 IQD');
  });

  it('renders an em dash when there is no price', () => {
    expect(formatMoney(null, 'ar')).toBe('—');
  });
});

describe('formatMoneyParts', () => {
  it('splits the amount from its currency label for the price display', () => {
    expect(formatMoneyParts('1325000', 'ar')).toEqual({ amount: '1,325,000', currency: 'د.ع' });
    expect(formatMoneyParts('1325000', 'en')).toEqual({ amount: '1,325,000', currency: 'IQD' });
    expect(formatMoneyParts(null, 'en')).toBeNull();
  });
});

describe('formatRating', () => {
  it('keeps one decimal in both languages', () => {
    expect(formatRating(4.8, 'ar')).toBe('4.8');
    expect(formatRating(5, 'en')).toBe('5.0');
    expect(formatRating(null, 'en')).toBe('—');
  });
});

describe('formatNumber', () => {
  it('localizes a bare count with no currency suffix', () => {
    expect(formatNumber(12, 'ar')).toBe('12');
    expect(formatNumber(2340, 'ar')).toBe('2,340');
    expect(formatNumber(12, 'en')).toBe('12');
  });
});

describe('formatQuantity', () => {
  it('matches formatNumber digits and keeps decimals', () => {
    expect(formatQuantity(1250, 'ar')).toBe('1,250');
    expect(formatQuantity(4.25, 'en')).toBe('4.25');
    expect(formatQuantity('7', 'ar')).toBe('7');
    expect(formatQuantity(undefined, 'ar')).toBe('');
  });
});
