import type { MetadataRoute } from 'next';

/**
 * Served at /manifest.webmanifest by Next.js's metadata route.
 *
 * Colours are the dark theme's --color-background (Bidoom's default), written as hex because a
 * manifest is read by the OS rather than the browser's CSS engine. Keep them in step with
 * globals.css by hand.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Bidoom — بيدوم',
    short_name: 'Bidoom',
    description: 'Live auctions marketplace',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#080706',
    theme_color: '#080706',
    lang: 'ar',
    dir: 'rtl',
    categories: ['shopping'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Separate entry, not `purpose: 'any maskable'`: a single icon claiming both makes
      // launchers that honour maskable crop into the mark.
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
