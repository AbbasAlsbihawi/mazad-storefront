/**
 * HTTP security headers for the storefront.
 *
 * The Content-Security-Policy is built per request by src/proxy.ts, because scripts are allowed by
 * a fresh nonce:
 * - script-src 'nonce-…' 'strict-dynamic': only scripts carrying this response's nonce run, plus
 *   the chunks they load. Next.js stamps the nonce on its own scripts (chunks and the inline
 *   `self.__next_f` flight payload) when the request carries the CSP; layout.tsx stamps the
 *   theme/locale script. No 'unsafe-inline'. 'self' is only a fallback for CSP2 browsers, which
 *   don't know 'strict-dynamic' (CSP3 browsers ignore 'self' next to it). No 'unsafe-eval' outside
 *   `next dev` (React's dev build needs it); zod runs jitless (shared/lib/zod-jitless.ts) so it
 *   doesn't probe for eval. JSON-LD (`type="application/ld+json"`) is a data block that is never
 *   executed, so script-src doesn't apply to it.
 *   The cost: every page is rendered per request (see docs/security.md).
 * - style-src keeps 'unsafe-inline': React style attributes and next/image set inline styles.
 *   Styles cannot run code; scripts stay nonce-only. Plus Google Fonts (globals.css imports the
 *   Cairo stylesheet, which loads its font files from fonts.gstatic.com).
 * - connect-src: this origin plus mazad-api over https and wss (REST + Socket.IO).
 * - img-src: this origin (next/image), the API's asset host, and Unsplash (demo seed photos).
 * - worker-src 'self': public/sw.js. manifest-src 'self': the web app manifest.
 * - frame-ancestors 'none' (and X-Frame-Options DENY for old browsers): no framing at all.
 *
 * The other headers don't vary per request and are set for every response in next.config.ts.
 */

function origin(url: string | undefined): URL | null {
  if (!url) return null;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export type CspOptions = {
  /** This response's script nonce (createNonce()). */
  nonce: string;
  /** mazad-api's base URL (NEXT_PUBLIC_API_URL). */
  apiUrl?: string;
  /** Where product photos are served from (NEXT_PUBLIC_ASSET_BASE_URL). */
  assetBaseUrl?: string;
  /** `next dev`: React's dev build needs eval, and hot reload talks over ws. */
  isDev?: boolean;
};

export function contentSecurityPolicy({
  nonce,
  apiUrl,
  assetBaseUrl,
  isDev = false,
}: CspOptions): string {
  const api = origin(apiUrl);
  const assets = origin(assetBaseUrl);
  const socket = api ? `${api.protocol === 'https:' ? 'wss:' : 'ws:'}//${api.host}` : null;
  const list = (...items: (string | null | undefined | false)[]) =>
    [...new Set(items.filter((item): item is string => Boolean(item)))].join(' ');

  return [
    "default-src 'self'",
    `script-src ${list(`'nonce-${nonce}'`, "'strict-dynamic'", "'self'", isDev && "'unsafe-eval'")}`,
    `connect-src ${list("'self'", api?.origin, socket, isDev && 'ws:')}`,
    `img-src ${list("'self'", 'data:', 'blob:', assets?.origin, 'https://images.unsplash.com')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    !isDev && 'upgrade-insecure-requests',
  ]
    .filter(Boolean)
    .join('; ');
}

/**
 * public/sw.js renders no page, so the proxy skips it and it gets no nonce. Its own CSP still
 * governs what the worker may load and fetch: its own origin only (it never handles anything else).
 */
export const SERVICE_WORKER_CSP = "default-src 'self'; object-src 'none'";

/** A fresh, unguessable nonce for one response (base64 of 16 random bytes). */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Headers that don't vary per request (next.config.ts `headers()`). */
export function staticSecurityHeaders() {
  return [
    // Two years, subdomains too. Not "preload": that is a commitment for the final domain.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    // Nothing here uses these. The share sheet and file pickers need no permission.
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
  ];
}
