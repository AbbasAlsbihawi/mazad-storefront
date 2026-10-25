'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants';
import { useLocaleStore } from '@shared/store';
import { authApi } from '../api/auth.api';
import type { AuthUser } from '../types/auth.types';
import { useCurrentUser } from './useCurrentUser';

/**
 * Keeps the account's notification language (`GET /me` `locale`) in step with the app's: after
 * sign-in or a restored session, and whenever the user switches language, a differing server
 * locale gets one best-effort `PATCH /me`. Never blocks or reverts the switch itself, and an
 * older API without `locale` (or a failed call) is left alone rather than retried in a loop.
 */
export function useLocaleSync() {
  const locale = useLocaleStore((state) => state.locale);
  const me = useCurrentUser();
  const queryClient = useQueryClient();
  const attempted = useRef<string | null>(null);
  const userId = me.data?.id;
  const serverLocale = me.data?.locale;

  useEffect(() => {
    if (!userId || !serverLocale || serverLocale === locale) return;
    const key = `${userId}:${locale}`;
    if (attempted.current === key) return;
    attempted.current = key;
    authApi
      .updateLocale(locale)
      .then(() => {
        queryClient.setQueryData<AuthUser>(QUERY_KEYS.auth.me, (user) =>
          user ? { ...user, locale } : user,
        );
      })
      .catch(() => {
        // Best-effort: the app's language already changed; notifications follow next time.
      });
  }, [userId, serverLocale, locale, queryClient]);
}

/** Mount once inside the providers; renders nothing. */
export function LocaleSync() {
  useLocaleSync();
  return null;
}
