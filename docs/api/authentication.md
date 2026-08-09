# Authentication

## Flow

1. User submits the login form (phone + password) → `useLogin` mutation fires
2. `authApi.login()` calls `POST /auth/login` → server returns `{ accessToken, refreshToken, sessionId, user }`
3. `useAuthStore.setSession()` writes the tokens and user to `localStorage` and updates the store
4. The `httpClient` request interceptor attaches `Authorization: Bearer <accessToken>` to every request
5. On a 401 outside `/auth/*` → the response interceptor tries `POST /auth/refresh` once; on success it retries the original request, on failure it clears the session and redirects to `/login`

Registration (`POST /auth/register`, phone + password + full name) returns the same
`{ accessToken, refreshToken, sessionId, user }` shape and logs the user in immediately — there
is no separate "verify your account" step for this flow. `mazad-api` also exposes phone+OTP
registration/login (`POST /auth/otp/request` then `/auth/otp/verify`, dev mode accepts the
static code `1111`) for a future pass; this app only wires the password flow today.

After a successful sign-in or registration, the hook redirects to `/`. There is no setup wizard —
the storefront has nothing to configure before browsing.

## Protected Routes

`AuthGuard` from `features/auth` wraps every authenticated route file:

```tsx
'use client';

import { AuthGuard, AccountPage } from '@features/auth';

export default function Route() {
  return (
    <AuthGuard>
      <AccountPage />
    </AuthGuard>
  );
}
```

It renders `<PageLoader />` until the session check passes, then the children. See [routing.md](../architecture/routing.md) for why this is a client guard rather than middleware.

## Auth Store

```ts
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (result: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  clearSession: () => void;
}
```

The tokens live in `localStorage` under the keys in `shared/constants/storage-keys.ts` because the Axios interceptor — which sits in `shared/` and cannot import this feature — reads them synchronously on every request. The store is their only writer, so the two can never drift. The store hydrates from `localStorage` at creation, validating the stored user with `userSchema` before trusting it.

## Logout

`useLogout` calls `POST /auth/logout` (best-effort — it revokes the session server-side), then clears the auth store and the whole React Query cache, and replaces the route with `/login`. If the network call fails, the local session is cleared anyway; there's nothing sensitive left to protect once the tokens are gone client-side.

## Token Refresh

Implemented in the Axios response interceptor (see [axios.md](./axios.md)): on a 401 from any endpoint other than `/auth/*`, it calls `POST /auth/refresh` with the stored `refreshToken` exactly once and retries the original request with the new `accessToken`. `mazad-api` rotates the refresh token on every use and revokes the whole session if a stale one is replayed (`REFRESH_TOKEN_REUSE`) — so a second consecutive 401 must clear the session rather than retry again, or a real reuse-detection event would loop.

Moving the session to an `httpOnly` cookie issued by `mazad-api` would let a Next `middleware.ts` protect routes before render, replacing the client-side `AuthGuard` — see [ADR-008](../../DECISIONS.md#adr-008-session-tokens-live-in-localstorage-behind-a-client-side-authguard).
