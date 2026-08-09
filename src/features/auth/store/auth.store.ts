import { create } from 'zustand';
import { setSessionTokens, type SessionTokens } from '@shared/api';

interface AuthState {
  setSession: (tokens: SessionTokens) => void;
  clearSession: () => void;
}

// Tokens themselves live in shared/api/auth-session.ts (ADR-008) — this store only exposes the
// actions that write through to it. Reactive "are we authenticated" state is read directly from
// that module via useIsAuthenticated (useSyncExternalStore with an explicit server snapshot), not
// mirrored here, since a zustand-cached copy can't give React an SSR-safe snapshot.
export const useAuthStore = create<AuthState>(() => ({
  setSession: (tokens) => setSessionTokens(tokens),
  clearSession: () => setSessionTokens(null),
}));
