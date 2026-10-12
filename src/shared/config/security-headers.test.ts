import { describe, expect, it } from 'vitest';
import {
  SERVICE_WORKER_CSP,
  contentSecurityPolicy,
  createNonce,
  staticSecurityHeaders,
} from './security-headers';

const API = 'https://mazad-api-production-e5a8.up.railway.app/api/v1';
const ASSETS = 'https://mazad-api-production-e5a8.up.railway.app/assets';

const directive = (csp: string, name: string) =>
  csp.split('; ').find((d) => d === name || d.startsWith(`${name} `)) ?? '';

describe('storefront content security policy', () => {
  const csp = contentSecurityPolicy({ nonce: 'abc123', apiUrl: API, assetBaseUrl: ASSETS });

  it("runs only scripts carrying this response's nonce: no unsafe-inline, no unsafe-eval", () => {
    expect(directive(csp, 'script-src')).toBe("script-src 'nonce-abc123' 'strict-dynamic' 'self'");
    expect(directive(csp, 'script-src')).not.toContain('unsafe-inline');
    expect(csp).not.toContain('unsafe-eval');
  });

  it('lets the service worker and the manifest load from this origin', () => {
    expect(directive(csp, 'worker-src')).toBe("worker-src 'self'");
    expect(directive(csp, 'manifest-src')).toBe("manifest-src 'self'");
  });

  it('lets the app reach the API over https and its Socket.IO over wss, nothing else', () => {
    expect(directive(csp, 'connect-src')).toBe(
      "connect-src 'self' https://mazad-api-production-e5a8.up.railway.app wss://mazad-api-production-e5a8.up.railway.app",
    );
  });

  it('allows product photos from the API asset host', () => {
    expect(directive(csp, 'img-src')).toContain('https://mazad-api-production-e5a8.up.railway.app');
  });

  it('loads the Cairo web font (Google Fonts stylesheet + font files)', () => {
    expect(directive(csp, 'style-src')).toContain('https://fonts.googleapis.com');
    expect(directive(csp, 'font-src')).toContain('https://fonts.gstatic.com');
  });

  it('never allows plugins, framing, base or form hijacking, and upgrades http', () => {
    expect(directive(csp, 'object-src')).toBe("object-src 'none'");
    expect(directive(csp, 'frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(directive(csp, 'base-uri')).toBe("base-uri 'self'");
    expect(directive(csp, 'form-action')).toBe("form-action 'self'");
    expect(directive(csp, 'upgrade-insecure-requests')).toBe('upgrade-insecure-requests');
  });

  it('allows eval and the hot-reload socket only in development', () => {
    const dev = contentSecurityPolicy({
      nonce: 'n',
      apiUrl: 'http://localhost:3001/api/v1',
      isDev: true,
    });
    expect(directive(dev, 'script-src')).toContain("'unsafe-eval'");
    expect(directive(dev, 'script-src')).not.toContain('unsafe-inline');
    expect(directive(dev, 'connect-src')).toContain('ws://localhost:3001');
    expect(directive(dev, 'upgrade-insecure-requests')).toBe('');
  });

  it('confines the service worker to its own origin', () => {
    expect(SERVICE_WORKER_CSP).toContain("default-src 'self'");
    expect(SERVICE_WORKER_CSP).not.toContain('unsafe');
  });
});

describe('createNonce', () => {
  it('is fresh each time and long enough to be unguessable', () => {
    const a = createNonce();
    expect(a).not.toBe(createNonce());
    expect(atob(a)).toHaveLength(16);
  });
});

describe('static security headers', () => {
  it('sends HSTS (no preload), nosniff, a referrer policy, X-Frame-Options and a permissions policy', () => {
    const keys = Object.fromEntries(staticSecurityHeaders().map((h) => [h.key, h.value]));
    expect(keys['Strict-Transport-Security']).toBe('max-age=63072000; includeSubDomains');
    expect(keys['X-Content-Type-Options']).toBe('nosniff');
    expect(keys['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(keys['X-Frame-Options']).toBe('DENY');
    expect(keys['Permissions-Policy']).toContain('camera=()');
    // The CSP varies per request, so it is never one of the static headers.
    expect(keys['Content-Security-Policy']).toBeUndefined();
  });
});
