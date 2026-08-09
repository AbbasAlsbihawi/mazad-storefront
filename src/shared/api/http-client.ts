import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ROUTES } from '@shared/constants';
import { useLocaleStore } from '@shared/store';
import { getSessionTokens, setSessionTokens, type SessionTokens } from './auth-session';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export const httpClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const tokens = getSessionTokens();
  if (tokens) {
    config.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }
  // mazad-api picks nameEn/nameAr from this header, default "ar" (see ADR-010).
  config.headers.set('Accept-Language', useLocaleStore.getState().locale);
  return config;
});

/** Bare axios, not httpClient — a refresh call must never itself re-enter this interceptor. */
async function refreshAccessToken(refreshToken: string): Promise<SessionTokens> {
  const response = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
  );
  return { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

function forceSignOut() {
  setSessionTokens(null);
  if (typeof window !== 'undefined') window.location.href = ROUTES.login;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = original?.url?.startsWith('/auth') ?? false;
    const tokens = getSessionTokens();

    if (!isUnauthorized || isAuthEndpoint || !tokens || !original) {
      return Promise.reject(error);
    }

    // mazad-api revokes the whole session on refresh-token reuse (REFRESH_TOKEN_REUSE) — a
    // second 401 on an already-retried request must not attempt another refresh (ADR-008).
    if (original._retried) {
      forceSignOut();
      return Promise.reject(error);
    }

    try {
      const refreshed = await refreshAccessToken(tokens.refreshToken);
      setSessionTokens(refreshed);
      original._retried = true;
      original.headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
      return httpClient(original);
    } catch (refreshError) {
      forceSignOut();
      return Promise.reject(refreshError);
    }
  },
);
