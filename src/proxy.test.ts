// @vitest-environment node
import { NextRequest } from 'next/server';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { describe, expect, it } from 'vitest';
import { config, proxy } from './proxy';

const req = (path: string) => new NextRequest(new URL(path, 'https://mazad.example'));
const nonceOf = (csp: string | null) => /'nonce-([^']+)'/.exec(csp ?? '')?.[1];
const scriptSrc = (csp: string | null) =>
  (csp ?? '').split('; ').find((d) => d.startsWith('script-src ')) ?? '';
const matches = (url: string, headers: Record<string, string> = {}) =>
  unstable_doesMiddlewareMatch({ config, url, headers });

describe('proxy security policy', () => {
  it('puts a CSP with a fresh nonce on every page response', () => {
    const first = proxy(req('/')).headers.get('Content-Security-Policy');
    const second = proxy(req('/auctions/abc')).headers.get('Content-Security-Policy');
    expect(first).toContain("frame-ancestors 'none'");
    expect(scriptSrc(first)).toMatch(/^script-src 'nonce-[^']+' 'strict-dynamic'/);
    expect(scriptSrc(first)).not.toContain('unsafe-inline');
    expect(nonceOf(first)).toBeTruthy();
    expect(nonceOf(second)).toBeTruthy();
    expect(nonceOf(first)).not.toBe(nonceOf(second));
  });

  it('hands the same nonce and policy to the render (request headers)', () => {
    const res = proxy(req('/help'));
    const csp = res.headers.get('Content-Security-Policy');
    // NextResponse.next({ request: { headers } }) forwards overridden request headers this way.
    expect(res.headers.get('x-middleware-request-x-nonce')).toBe(nonceOf(csp));
    expect(res.headers.get('x-middleware-request-content-security-policy')).toBe(csp);
  });

  it('runs for pages', () => {
    for (const path of [
      '/',
      '/auctions',
      '/auctions/abc',
      '/stores/s1',
      '/login',
      '/help/privacy',
    ]) {
      expect(matches(path)).toBe(true);
    }
  });

  it('skips build output, images, public files, metadata routes and API routes', () => {
    for (const path of [
      '/_next/static/chunks/main.js',
      '/_next/image?url=%2Ficon-192.png&w=64&q=75',
      '/favicon.png',
      '/icon-192.png',
      '/icon-maskable-512.png',
      '/apple-touch-icon.png',
      '/sw.js',
      '/offline.html',
      '/manifest.webmanifest',
      '/robots.txt',
      '/api/health',
    ]) {
      expect(matches(path)).toBe(false);
    }
  });

  it('skips router prefetches (RSC data, not a document)', () => {
    expect(matches('/auctions', { 'next-router-prefetch': '1' })).toBe(false);
    expect(matches('/auctions', { purpose: 'prefetch' })).toBe(false);
  });
});
