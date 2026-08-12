import { describe, expect, it } from 'vitest';
import { fromDateTimeInputValue, toDateTimeInputValue } from './datetime-input';

describe('datetime-input', () => {
  it('round-trips a wall-clock time through the browser zone', () => {
    // Whatever the runner's zone, "6:30pm local" must survive both conversions unchanged —
    // a seller scheduling an auction for 6:30pm means 6:30pm where they are.
    const wallClock = '2026-08-11T18:30';

    expect(toDateTimeInputValue(fromDateTimeInputValue(wallClock))).toBe(wallClock);
  });

  it('produces an instant the API will accept', () => {
    const iso = fromDateTimeInputValue('2026-08-11T18:30');

    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(new Date(iso).getHours()).toBe(18);
  });

  it('pads single-digit months, days and hours', () => {
    const iso = new Date(2026, 0, 5, 9, 7).toISOString();

    expect(toDateTimeInputValue(iso)).toBe('2026-01-05T09:07');
  });

  it('returns empty rather than throwing on junk', () => {
    expect(fromDateTimeInputValue('')).toBe('');
    expect(fromDateTimeInputValue('not-a-date')).toBe('');
    expect(toDateTimeInputValue('not-a-date')).toBe('');
  });
});
