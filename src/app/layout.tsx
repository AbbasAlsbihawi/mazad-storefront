import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { AppProviders, AppShell } from './providers';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Mazad',
  description: 'Live auctions marketplace',
};

// Reads the persisted locale/theme and stamps <html> before hydration, so neither the wrong
// direction nor the wrong palette ever flashes (ADR-011). Vanilla JS only — this runs before
// any bundled module, including Zustand, so it can't import the stores it's reading.
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      {/* suppressHydrationWarning: some browser extensions (e.g. Grammarly) inject data-gr-*
          attributes into <body> before React hydrates; harmless, but noisy without this. */}
      <body suppressHydrationWarning>
        <Script
          id="theme-locale-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_LOCALE_INIT_SCRIPT }}
        />
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
