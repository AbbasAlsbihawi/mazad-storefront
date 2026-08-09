'use client';

import { useSyncExternalStore } from 'react';

let offsetMs = 0;
const listeners = new Set<() => void>();

/**
 * Called whenever a response carries `serverTime` (currently GET /homepage). Every countdown
 * reads through the resulting offset instead of the visitor's own clock (ADR-013).
 */
export function recordServerTime(serverTimeIso: string): void {
  offsetMs = new Date(serverTimeIso).getTime() - Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return offsetMs;
}

function getServerSnapshot() {
  return 0;
}

export function useServerClock() {
  const offset = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { offset, now: () => Date.now() + offset };
}
