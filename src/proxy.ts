import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { contentSecurityPolicy, createNonce } from '@shared/config/security-headers';

/**
 * Every page response gets a Content-Security-Policy with a fresh script nonce. The policy is also
 * put on the request: Next.js reads the nonce from it to stamp its own scripts, and `x-nonce` lets
 * layout.tsx stamp the theme/locale script.
 */
export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const csp = contentSecurityPolicy({
    nonce,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    assetBaseUrl: process.env.NEXT_PUBLIC_ASSET_BASE_URL,
    isDev: process.env.NODE_ENV === 'development',
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only. Not build output, optimised images, API routes, or the files in public/ and the
      // metadata routes: none of them is an HTML page that runs scripts. offline.html is static and
      // served by the service worker; sw.js gets its own policy in next.config.ts.
      source:
        '/((?!_next/static|_next/image|api/|sw\\.js|offline\\.html|manifest\\.webmanifest|robots\\.txt|favicon\\.png|apple-touch-icon\\.png|icon-[\\w-]+\\.png).*)',
      // Router prefetches fetch RSC data, not a document: no policy (and no nonce) needed.
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
