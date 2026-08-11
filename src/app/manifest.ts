import type { MetadataRoute } from 'next';

/**
 * Served at /manifest.webmanifest by Next.js's metadata route.
 *
 * Colours are the light theme's --color-background and --color-primary, written as hex because
 * a manifest is read by the OS rather than the browser's CSS engine and gets no say in oklch or
 * custom properties. Keep them in step with globals.css by hand.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Mazad — مزاد',
    short_name: 'Mazad',
    description: 'Live auctions marketplace',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // The layout is a phone column throughout; there is no landscape design to fall back on.
    orientation: 'portrait',
    background_color: '#f6f7f9',
    theme_color: '#f6f7f9',
    lang: 'ar',
    dir: 'rtl',
    categories: ['shopping'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Separate entry, not `purpose: 'any maskable'` — a single icon claiming both makes
      // launchers that honour maskable crop into the mark.
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
