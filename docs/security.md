# Security

## Authentication Tokens

- Access tokens stored in `localStorage`, under the keys in `shared/constants/storage-keys.ts`.
- Never log tokens or include them in error reports. `getErrorMessage()` in `shared/lib` returns only the backend's `message` field or a translated fallback — never the raw response.
- On 401 outside `/auth/*`, the Axios interceptor clears the session and redirects to login.
- For production with sensitive data, consider `httpOnly` cookies instead of `localStorage`. That would also allow route protection in Next middleware rather than the client-side `AuthGuard` ([ADR-008](../DECISIONS.md#adr-008-session-tokens-live-in-localstorage-behind-a-client-side-authguard)).

## XSS Prevention

- React escapes all JSX output by default. Avoid `dangerouslySetInnerHTML`; the only uses are the static theme/locale script, escaped JSON-LD, and the built-in icon glyphs.
- Validate and sanitize any user-generated content before rendering.
- The Content Security Policy is set per request by `src/proxy.ts`; the other security headers are set for every response in `next.config.ts`. Both come from `src/shared/config/security-headers.ts` (see [Content Security Policy](#content-security-policy)).

## CSRF

For cookie-based auth, include a CSRF token header on mutations. With JWT in Authorization headers (current approach), CSRF is not a concern.

## Input Validation

All form input is validated by Zod before submission. Never trust client-side validation alone — the server must validate too.

## Environment Variables

- Never put secrets in `NEXT_PUBLIC_*` variables — they are embedded in the client bundle at build time. This app uses four, none of them secret:
  - `NEXT_PUBLIC_API_URL`: mazad-api's base URL, including `/api/v1` (REST, and the Socket.IO origin).
  - `NEXT_PUBLIC_ASSET_BASE_URL`: where product photos are served from.
  - `NEXT_PUBLIC_SITE_URL`: the storefront's public origin, for canonical and Open Graph URLs (optional).
  - `NEXT_PUBLIC_NOINDEX`: `true` keeps a deployment (staging, beta) out of search engines.
- `API_INTERNAL_URL` is server-only (not `NEXT_PUBLIC_`): an optional private API address for server-side metadata fetches.
- API keys that must remain secret belong on the server, proxied through your backend.

## Dependency Hygiene

```bash
npm audit          # check for known vulnerabilities
npm audit fix      # auto-fix where possible
```

Run `npm audit` in CI. Block merges with high/critical vulnerabilities.

## Content Security Policy

Scripts run only with a per-request nonce. `src/proxy.ts` (the Next.js 16 name for middleware)
creates a fresh nonce for every page request and sends the policy from
`src/shared/config/security-headers.ts` on the response. It also puts the policy on the request,
where Next.js reads the nonce and stamps it on its own scripts: the chunk `<script>` tags and the
inline `self.__next_f.push(...)` flight payload. `layout.tsx` reads the nonce from the `x-nonce`
request header for the one inline script of our own, the theme/locale script.

- `script-src 'nonce-…' 'strict-dynamic' 'self'`: no `'unsafe-inline'`, so an injected inline
  script or event handler (`onerror=…`) does not run. `'strict-dynamic'` trusts what nonced scripts
  load (webpack chunks); `'self'` is only a fallback for CSP2 browsers that don't know it. No
  `'unsafe-eval'` outside `next dev` (zod runs jitless, `shared/lib/zod-jitless.ts`).
- JSON-LD (`<script type="application/ld+json">` on auction pages) is a data block that the browser
  never executes, so it is not subject to `script-src` and was never a reason for
  `'unsafe-inline'`. What keeps it safe is the escaping of its content, not the CSP.
- `style-src` keeps `'unsafe-inline'` (React style attributes, next/image) plus Google Fonts; styles
  cannot run code. `font-src` allows `fonts.gstatic.com` for the Cairo font.
- `connect-src`: this origin plus mazad-api over https and wss (REST and Socket.IO). `img-src`: this
  origin, the API's asset host and Unsplash.
- `worker-src 'self'` (the service worker, `public/sw.js`) and `manifest-src 'self'`.
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`,
  `upgrade-insecure-requests` (not in `next dev`).
- Static headers on every response (`next.config.ts`): HSTS for two years with subdomains and
  without preload, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY`, and a `Permissions-Policy` that turns off camera, microphone,
  geolocation, payment and USB. `X-Powered-By` is not sent.

The proxy skips what is not a page: `_next/static`, `_next/image`, API routes, the icons,
`sw.js`, `offline.html`, `manifest.webmanifest`, `robots.txt`, and router prefetches.
`sw.js` gets its own fixed policy (`default-src 'self'`). `offline.html` is a static file with no
user content (its retry button uses an inline `onclick`, which a nonce policy would block), so it
has none.

### Cost: every page is rendered per request

A nonce must be new for every response, so it cannot be baked into prerendered HTML. Reading the
request headers in the root layout makes every page dynamic. `next build` before and after:

| Routes                                                                                                                                      | Before    | After     |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- |
| `/`, `/auctions`, `/login`, `/register`, `/reset-password`, `/help`, `/account-deletion`, the 14 static `/account/...` pages, `/_not-found` | ○ static  | ƒ dynamic |
| `/help/[topic]` (6 topics)                                                                                                                  | ● SSG     | ƒ dynamic |
| `/auctions/[id]`, `/stores/[id]`, `/sellers/[id]`, `/account/orders/[id]`, `/account/selling/sales/[id]`                                    | ƒ dynamic | ƒ dynamic |
| `/manifest.webmanifest`, `/robots.txt`                                                                                                      | ○ static  | ○ static  |

What that means:

- HTML responses are now `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
  instead of `s-maxage=31536000` from the prerender cache. A CDN in front of the storefront cannot
  cache the HTML; `/_next/static` assets stay immutable and cacheable as before.
- Each page view runs a server render. Most pages are thin server shells around client components
  that fetch their data in the browser, so the render is cheap: measured locally with `next start`
  (20 requests each to `/`, `/auctions`, `/help`, `/help/privacy`), time to first byte went from
  about 2 ms (prerendered) to 7–8 ms (median). The auction page's metadata fetch still uses the
  fetch cache (`revalidate`), so it doesn't hit the API on every view.
- Partial Prerendering and ISR are incompatible with a nonce policy. If HTML caching ever matters
  more than the CSP, the alternative is Next.js's experimental SRI (hash-based) policy.

## Sensitive Data in Logs

Never log: passwords, tokens, PII (email, phone, name), payment data. The ESLint `no-console` rule (`warn` level) catches accidental `console.log` calls.
