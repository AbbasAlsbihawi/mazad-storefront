import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCountdown } from './useCountdown';

const START = new Date('2026-08-11T12:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(START);
});

afterEach(() => {
  vi.useRealTimers();
});

/** An ISO timestamp `seconds` in the future from the frozen clock. */
function inSeconds(seconds: number) {
  return new Date(START.getTime() + seconds * 1000).toISOString();
}

describe('useCountdown', () => {
  it('counts down as time passes', () => {
    const { result } = renderHook(() => useCountdown(inSeconds(60)));
    expect(result.current).toBe(60_000);

    act(() => void vi.advanceTimersByTime(3000));

    // The regression this covers: AuctionCard computed the remaining time once per render and
    // never re-rendered, so the card's clock sat frozen at whatever it first showed.
    expect(result.current).toBe(57_000);
  });

  it('keeps going past zero so callers can decide what ended means', () => {
    const { result } = renderHook(() => useCountdown(inSeconds(2)));

    act(() => void vi.advanceTimersByTime(5000));

    expect(result.current).toBe(-3000);
  });

  it('shares one interval across every mounted countdown', () => {
    const setInterval = vi.spyOn(globalThis, 'setInterval');
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');

    const first = renderHook(() => useCountdown(inSeconds(60)));
    const second = renderHook(() => useCountdown(inSeconds(90)));
    expect(setInterval).toHaveBeenCalledTimes(1);

    // Both readings advance off that single timer, so neighbouring cards can't disagree.
    act(() => void vi.advanceTimersByTime(1000));
    expect(first.result.current).toBe(59_000);
    expect(second.result.current).toBe(89_000);

    // ...and the timer is torn down only once nothing is counting any more.
    first.unmount();
    expect(clearInterval).not.toHaveBeenCalled();
    second.unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
