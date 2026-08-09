'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@shared/constants';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    // onSettled, not onSuccess — cleanup must run even when the network call itself fails.
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace(ROUTES.login);
    },
  });
}
