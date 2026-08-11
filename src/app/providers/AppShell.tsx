'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { ROUTES } from '@shared/constants';
import { AppTabBar, type AppTabBarVariant } from '@shared/components/layout';
import { AuctionCardActionProvider } from '@shared/components/cards';
import { cn } from '@shared/lib';

// Keeps watchlist's JS out of routes that never render an AuctionCard (login/register) — this is
// still the one place app/ composes a feature into shared/'s presentational components; the
// shared components themselves stay feature-agnostic (see AGENTS.md's dependency rules).
const WatchlistToggle = dynamic(
  () => import('@features/watchlist').then((m) => ({ default: m.WatchlistToggle })),
  { ssr: false },
);

// Auth is a modal-style flow, not a tab root: showing the bar there would offer navigation the
// user can't act on yet.
const CHROMELESS_ROUTES: string[] = [ROUTES.login, ROUTES.register];

// Pushed screens replace the tab bar with their own back chevron and bottom action bar — two
// competing fixed bars at the bottom is the thing the HIG structure exists to prevent.
const PUSHED_ROUTE_PATTERN = /^\/(auctions|stores|sellers)\/[^/]+$/;

// The bar is one piece of chrome shared by all five roots, so the variant is chosen once, here.
// Floating: four of the five roots are photo-led — the home feed, the browse grid, the watchlist
// grid, the bids list — and the capsule lets those images run to the bottom edge. Picking per
// screen would swap the bar out mid-flow, which is exactly what the design system rules out.
const TAB_BAR_VARIANT: AppTabBarVariant = 'floating';

// Each variant occupies a different amount of the bottom edge; the scroll area clears whichever
// one is mounted. Keep in step with --spacing-tab-bar-floating in globals.css.
const TAB_BAR_CLEARANCE: Record<AppTabBarVariant, string> = {
  docked: 'pb-[calc(var(--spacing-tab-bar)+var(--spacing-safe-bottom))]',
  floating: 'pb-[calc(var(--spacing-tab-bar-floating)+env(safe-area-inset-bottom))]',
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasTabBar = !CHROMELESS_ROUTES.includes(pathname) && !PUSHED_ROUTE_PATTERN.test(pathname);

  return (
    // The design is a phone app; on a wide viewport it stays a centered phone-width column
    // rather than stretching into a layout the system was never drawn for. Relative so the
    // floating capsule has a positioned parent to measure against.
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <AuctionCardActionProvider render={(auctionId) => <WatchlistToggle auctionId={auctionId} />}>
        <main
          className={cn(
            'flex-1',
            // Clears the tab bar plus the home-indicator inset, so the last row of a feed is
            // never trapped behind the chrome.
            hasTabBar && TAB_BAR_CLEARANCE[TAB_BAR_VARIANT],
          )}
        >
          {children}
        </main>
      </AuctionCardActionProvider>
      {hasTabBar ? <AppTabBar variant={TAB_BAR_VARIANT} /> : null}
    </div>
  );
}
