'use client';

import { createContext, useContext, type ReactNode } from 'react';

type AuctionCardActionRenderer = (auctionId: string) => ReactNode;

const AuctionCardActionContext = createContext<AuctionCardActionRenderer | null>(null);

// Lets app/ compose a feature's per-auction action (e.g. watchlist/@features/watchlist's
// WatchlistToggle) into AuctionCard without AuctionCard — or any of the 5+ unrelated pages that
// render it via AuctionGrid — importing that feature. Provided once, high up (see AppShell).
export function AuctionCardActionProvider({
  render,
  children,
}: {
  render: AuctionCardActionRenderer;
  children: ReactNode;
}) {
  return (
    <AuctionCardActionContext.Provider value={render}>{children}</AuctionCardActionContext.Provider>
  );
}

export function useAuctionCardAction(): AuctionCardActionRenderer | null {
  return useContext(AuctionCardActionContext);
}
