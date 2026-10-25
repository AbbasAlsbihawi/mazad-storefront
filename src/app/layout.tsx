import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { BrandSprite } from '@shared/components/brand';
import { SITE_NAME, isNoIndex, siteUrl } from '@shared/seo';
import { FONT_VARIABLES } from './fonts';
import { AppProviders, AppShell } from './providers';
import './styles/globals.css';

const SITE_DESCRIPTION =
  'مزادات مباشرة في العراق: زايد على المنتجات من بائعين موثوقين · Live auctions marketplace in Iraq';
const site = siteUrl();

export const metadata: Metadata = {
  // Absolute Open Graph/canonical URLs only when NEXT_PUBLIC_SITE_URL is configured.
  ...(site ? { metadataBase: site } : {}),
  // Staging/beta (NEXT_PUBLIC_NOINDEX=true): no page of this deployment belongs in an index.
  ...(isNoIndex() ? { robots: { index: false, follow: false } } : {}),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ar_IQ',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  applicationName: 'Bidoom',
  manifest: '/manifest.webmanifest',
  // iOS ignores the manifest entirely; these are what make an added-to-home-screen Bidoom open
  // without Safari's chrome.
  appleWebApp: { capable: true, title: 'Bidoom', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lets the layout extend under the notch and the home indicator, which is the only thing that
  // makes env(safe-area-inset-*) report anything but 0: the floating tab bar sits on it.
  viewportFit: 'cover',
  // The theme is a stored preference rather than a media query, so the browser chrome can only
  // follow the device. Each colour is that theme's --color-background.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4eedf' },
    { media: '(prefers-color-scheme: dark)', color: '#080706' },
  ],
};

// Reads the persisted locale/theme and stamps <html> before first paint, so neither the wrong
// direction nor the wrong palette ever flashes (ADR-011). It is a plain inline script in <head>,
// which the browser runs synchronously while parsing, not next/script's beforeInteractive, which
// in the App Router is queued and only runs once the framework chunks have loaded. Vanilla JS
// only: this runs before any bundled module, including Zustand, so it can't import the stores
// it's reading. Dark is the default; only a stored "light" stamps data-theme.
const THEME_LOCALE_INIT_SCRIPT = `
(function () {
  try {
    var locale = 'ar';
    var theme = 'dark';
    var localeRaw = localStorage.getItem('mazad.locale');
    if (localeRaw) {
      var parsedLocale = JSON.parse(localeRaw);
      if (parsedLocale && parsedLocale.state && parsedLocale.state.locale) {
        locale = parsedLocale.state.locale;
      }
    }
    var themeRaw = localStorage.getItem('mazad.theme');
    if (themeRaw) {
      var parsedTheme = JSON.parse(themeRaw);
      if (parsedTheme && parsedTheme.state && parsedTheme.state.theme) {
        theme = parsedTheme.state.theme;
      }
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  // This request's CSP script nonce, from src/proxy.ts. Reading request headers renders every page
  // per request: a nonce can't be baked into prerendered HTML (docs/security.md).
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="ar" dir="rtl" className={FONT_VARIABLES} suppressHydrationWarning>
      <head>
        <script
          id="theme-locale-init"
          nonce={nonce}
          // Browsers hide a nonce from the DOM after parsing, so it never matches on hydration.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_LOCALE_INIT_SCRIPT }}
        />
      </head>
      {/* suppressHydrationWarning: some browser extensions (e.g. Grammarly) inject data-gr-*
          attributes into <body> before React hydrates; harmless, but noisy without this. */}
      <body suppressHydrationWarning>
        <BrandSprite />
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
