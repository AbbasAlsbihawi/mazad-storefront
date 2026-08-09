import { STORAGE_KEYS } from '@shared/constants';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

type Listener = (tokens: SessionTokens | null) => void;

/**
 * Session token storage lives in shared/, not features/auth/, because http-client.ts's
 * interceptors need synchronous access to the current token and cannot import a feature
 * (see ADR-008). features/auth's Zustand store subscribes here instead of owning the tokens
 * itself, so a silent refresh triggered by the interceptor still updates the UI's session state.
 *
 * The user's profile is not part of this module — it's server data and belongs in TanStack
 * Query's cache (features/auth's `/me` query), never mirrored into a store (ADR-003).
 */
function readStoredTokens(): SessionTokens | null {
  if (typeof window === 'undefined') return null;
  const accessToken = window.localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = window.localStorage.getItem(STORAGE_KEYS.refreshToken);
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

let currentTokens: SessionTokens | null = readStoredTokens();
const listeners = new Set<Listener>();

export function getSessionTokens(): SessionTokens | null {
  return currentTokens;
}

export function setSessionTokens(tokens: SessionTokens | null): void {
  currentTokens = tokens;

  if (typeof window !== 'undefined') {
    if (tokens) {
      window.localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
      window.localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.accessToken);
      window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
    }
  }

  listeners.forEach((listener) => listener(tokens));
}

export function subscribeToSessionTokens(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
