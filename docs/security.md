# Security

## Authentication Tokens

- Access tokens stored in `localStorage`, under the keys in `shared/constants/storage-keys.ts`.
- Never log tokens or include them in error reports. `getErrorMessage()` in `shared/lib` returns only the backend's `message` field or a translated fallback — never the raw response.
- On 401 outside `/auth/*`, the Axios interceptor clears the session and redirects to login.
- For production with sensitive data, consider `httpOnly` cookies instead of `localStorage`. That would also allow route protection in Next middleware rather than the client-side `AuthGuard` ([ADR-008](../DECISIONS.md#adr-008-session-tokens-live-in-localstorage-behind-a-client-side-authguard)).

## XSS Prevention

- React escapes all JSX output by default. Avoid `dangerouslySetInnerHTML`; the only uses are the static theme/locale script and escaped JSON-LD.
- Validate and sanitize any user-generated content before rendering.
- The Content Security Policy and the other security headers are set for every response in `next.config.ts` from `src/shared/config/security-headers.ts`.

## CSRF

For cookie-based auth, include a CSRF token header on mutations. With JWT in Authorization headers (current approach), CSRF is not a concern.

## Input Validation

All form input is validated by Zod before submission. Never trust client-side validation alone — the server must validate too.

## Environment Variables

- Never put secrets in `NEXT_PUBLIC_*` variables — they are embedded in the client bundle. The only one this app uses is `NEXT_PUBLIC_API_URL`.
- API keys that must remain secret belong on the server, proxied through your backend.

## Dependency Hygiene

```bash
npm audit          # check for known vulnerabilities
npm audit fix      # auto-fix where possible
```

Run `npm audit` in CI. Block merges with high/critical vulnerabilities.

## Content Security Policy

`src/shared/config/security-headers.ts` builds the policy: `connect-src` this origin plus mazad-api
over https and wss; images from this origin, the API's asset host and Unsplash; Google Fonts for the
Cairo font; `frame-ancestors 'none'`; HSTS for two years without preload. `script-src` still allows
`'unsafe-inline'`, because the App Router streams its payload through inline scripts; removing it
needs a per-request nonce (as the admin dashboard does), which would render every page dynamically.
There is no `'unsafe-eval'` (zod runs jitless).

## Sensitive Data in Logs

Never log: passwords, tokens, PII (email, phone, name), payment data. The ESLint `no-console` rule (`warn` level) catches accidental `console.log` calls.
