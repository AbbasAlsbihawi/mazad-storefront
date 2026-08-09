'use client';

import { useToastStore } from '@shared/store';

export function useToast() {
  const push = useToastStore((state) => state.push);

  return {
    success: (message: string) => push({ message, variant: 'success' as const }),
    error: (message: string) => push({ message, variant: 'error' as const }),
    info: (message: string) => push({ message, variant: 'info' as const }),
  };
}
