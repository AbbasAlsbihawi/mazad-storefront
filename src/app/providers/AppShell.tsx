'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useIsAuthenticated, useLogout } from '@features/auth';
import { Header, Footer } from '@shared/components/layout';
import { AuctionCardActionProvider } from '@shared/components/cards';

// Keeps watchlist's JS out of routes that never render an AuctionCard (login/register) — this is
// still the one place app/ composes a feature into shared/'s presentational components; Header
// and AuctionCard themselves stay feature-agnostic (see AGENTS.md's dependency rules).
const WatchlistToggle = dynamic(
  () => import('@features/watchlist').then((m) => ({ default: m.WatchlistToggle })),
  { ssr: false },
);

export function AppShell({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const logout = useLogout();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header isAuthenticated={isAuthenticated} onSignOut={() => logout.mutate()} />
      <AuctionCardActionProvider render={(auctionId) => <WatchlistToggle auctionId={auctionId} />}>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      </AuctionCardActionProvider>
      <Footer />
    </div>
  );
}
