'use client';

import { useToastStore } from '@shared/store';

/**
 * Every mutation confirms — silence after a successful write is a bug in this system, not a
 * design choice.
 */
export function useToast() {
  const push = useToastStore((state) => state.push);

  return {
    success: (message: string, detail?: string) => push({ message, detail, variant: 'success' }),
    error: (message: string, detail?: string) => push({ message, detail, variant: 'error' }),
    info: (message: string, detail?: string) => push({ message, detail, variant: 'info' }),
    bid: (message: string, detail?: string) => push({ message, detail, variant: 'bid' }),
  };
}
