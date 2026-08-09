'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { QUERY_KEYS, ROUTES } from '@shared/constants';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { RegisterValues } from '../types/auth.types';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterValues) => authApi.register(values),
    onSuccess: (result) => {
      setSession({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      queryClient.setQueryData(QUERY_KEYS.auth.me, result.user);
      router.replace(ROUTES.home);
    },
  });
}
