'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { ErrorState } from '@shared/components/feedback';
import { Card, Skeleton, buttonVariants } from '@shared/components/ui';
import { BottomActionBar } from '@shared/components/ios';
import { useIsAuthenticated } from '@shared/hooks';
import { toMinorUnits } from '@shared/lib';
import { useAuctionPricing } from '../hooks/useAuctionPricing';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import { useMyStanding } from '../hooks/useMyStanding';
import { userStateOf } from '../lib/user-state';
import { BidForm } from './BidForm';
import { BuyNowButton } from './BuyNowButton';
import { AutoBidControl } from './AutoBidControl';
import { UserStateLine } from './UserStateLine';
import type { AuctionPricing } from '../types/bidding.types';

export interface BidPanelProps {
  auctionId: string;
  /** The viewer is this auction's seller: nothing to bid (mazad-api OWN_AUCTION_BID). */
  isOwnAuction?: boolean;
  /**
   * The viewer won this auction (from GET /me/wins, composed by the route): its order, or null
   * while auto-fulfilment is still creating it. Absent for everyone else.
   */
  winner?: { orderId: string | null } | null;
  /** The wins are still loading for a closed auction: wait rather than say "sold to another". */
  isCheckingWin?: boolean;
}

/** Buy now only while the bidding hasn't reached it (the server refuses it after that). */
function canBuyNow(pricing: AuctionPricing): pricing is AuctionPricing & { buyNowPrice: string } {
  const buyNow = toMinorUnits(pricing.buyNowPrice);
  const current = toMinorUnits(pricing.currentPrice);
  return buyNow != null && (current == null || current < buyNow);
}

/**
 * The viewer's state on the auction (one line, see userStateOf) and what they can do about it:
 * bid, buy now and auto-bid for a buyer on a live auction, the way to the order for the winner,
 * sign-in for a guest. The seller's own auction gets the state only.
 */
export function BidPanel({
  auctionId,
  isOwnAuction = false,
  winner = null,
  isCheckingWin = false,
}: BidPanelProps) {
  const { t, isReady } = useBiddingTranslation();
  const isAuthenticated = useIsAuthenticated();
  const pricing = useAuctionPricing(auctionId);
  const standing = useMyStanding(auctionId);

  // A skeleton the size of the real bid card, so the CTA doesn't jump into place under the
  // user's thumb once pricing resolves.
  if (!isReady || pricing.isPending || isCheckingWin) {
    return <Skeleton radius="lg" className="h-28 w-full" />;
  }

  if (pricing.isError || !pricing.data) {
    return <ErrorState message={t('panel.loadError')} onRetry={() => void pricing.refetch()} />;
  }

  const state = userStateOf({
    status: pricing.data.status,
    isOwnAuction,
    isWinner: Boolean(winner),
    isAuthenticated,
    standing,
  });

  // Signed out on a live auction: the sign-in button is the state line.
  if (state.kind === 'signIn') {
    return (
      <BottomActionBar>
        <Link href={ROUTES.login} className={buttonVariants({ size: 'lg', isFullWidth: true })}>
          {t('panel.signInToBid')}
        </Link>
      </BottomActionBar>
    );
  }

  const canBid = pricing.data.status === 'LIVE' && state.kind !== 'own' && state.kind !== 'won';

  return (
    <div className="flex flex-col gap-3">
      <UserStateLine state={state} />

      {/* The winner of a closed auction: the way to what the win became. */}
      {state.kind === 'won' && winner ? (
        <BottomActionBar>
          <Link
            href={winner.orderId ? ROUTES.orderDetail(winner.orderId) : ROUTES.wins}
            className={buttonVariants({ size: 'lg', isFullWidth: true })}
            data-testid="won-view-order"
          >
            {t(winner.orderId ? 'panel.wonViewOrder' : 'panel.wonViewWins')}
          </Link>
        </BottomActionBar>
      ) : null}

      {canBid ? (
        <>
          <BidForm auction={pricing.data} />
          {canBuyNow(pricing.data) ? (
            <Card isInset>
              <BuyNowButton auctionId={auctionId} buyNowPrice={pricing.data.buyNowPrice} />
            </Card>
          ) : null}
          <AutoBidControl auctionId={auctionId} />
        </>
      ) : null}
    </div>
  );
}
