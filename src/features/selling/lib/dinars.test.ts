import { describe, expect, it } from 'vitest';
import { groupDinars, parseDinars } from './dinars';

describe('groupDinars', () => {
  it('groups a whole number as it is typed, Arabic digits included', () => {
    expect(groupDinars('1250000')).toBe('1,250,000');
    expect(groupDinars('1,2500')).toBe('12,500');
    expect(groupDinars('١٢٥٠٠٠')).toBe('125,000');
    expect(groupDinars('0750')).toBe('750');
  });

  it('leaves anything else as typed, for the validation message', () => {
    expect(groupDinars('1250.5')).toBe('1250.5');
    expect(groupDinars('abc')).toBe('abc');
    expect(groupDinars('')).toBe('');
  });

  it('round-trips through parseDinars', () => {
    expect(parseDinars(groupDinars('9876543'))).toEqual({ value: 9_876_543 });
  });
});
