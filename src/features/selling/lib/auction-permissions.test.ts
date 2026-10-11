import { describe, expect, it } from 'vitest';
import {
  canCancelAuction,
  canEditAuction,
  canRelistAuction,
  canSubmitAuction,
  getSellerAuctionTone,
  relistableProductIds,
} from './auction-permissions';
import { SELLER_AUCTION_STATUSES } from '../schemas/selling.schema';
import type { SellerAuctionStatus } from '../types/selling.types';

/*
 * These mirror mazad-api's AuctionsService/AuctionStateMachineService. If the API's rules move,
 * these are the tests that should fail — the seller must never be shown a button that 409s.
 */

const EDITABLE: SellerAuctionStatus[] = ['DRAFT', 'REJECTED'];

describe('canEditAuction', () => {
  it('allows only DRAFT and REJECTED', () => {
    for (const status of SELLER_AUCTION_STATUSES) {
      expect(canEditAuction(status)).toBe(EDITABLE.includes(status));
    }
  });
});

describe('canSubmitAuction', () => {
  it('allows a draft, and a rejected listing once the seller has fixed it', () => {
    for (const status of SELLER_AUCTION_STATUSES) {
      expect(canSubmitAuction(status)).toBe(EDITABLE.includes(status));
    }
  });
});

describe('canCancelAuction', () => {
  it('allows cancelling before anyone can have bid', () => {
    for (const status of ['DRAFT', 'PENDING_APPROVAL', 'SCHEDULED', 'REJECTED'] as const) {
      expect(canCancelAuction({ status, bidCount: 0 })).toBe(true);
    }
  });

  it('allows cancelling a live listing only while it has no bids', () => {
    expect(canCancelAuction({ status: 'LIVE', bidCount: 0 })).toBe(true);
    // Pulling a lot out from under real bidders is an admin force-cancel, not a seller action.
    expect(canCancelAuction({ status: 'LIVE', bidCount: 1 })).toBe(false);
  });

  it('refuses once the auction is over, however it ended', () => {
    for (const status of ['ENDED', 'SOLD', 'UNSOLD', 'CANCELLED'] as const) {
      expect(canCancelAuction({ status, bidCount: 0 })).toBe(false);
    }
  });

  it('lets the seller withdraw a listing that is still awaiting approval', () => {
    expect(canCancelAuction({ status: 'PENDING_APPROVAL', bidCount: 0 })).toBe(true);
  });
});

describe('relisting only products that can still be auctioned', () => {
  const product = (id: string) => ({ id, nameEn: id, nameAr: id });
  const free = { status: 'UNSOLD' as const, product: product('p-free') };
  const blocked = { status: 'UNSOLD' as const, product: product('p-blocked') };
  // p-relisted already has a new auction running: a second one would 409.
  const relisted = { status: 'CANCELLED' as const, product: product('p-relisted') };
  const running = { status: 'LIVE' as const, product: product('p-relisted') };
  const auctions = [free, blocked, relisted, running];
  const products = [
    { id: 'p-free', isBlocked: false },
    { id: 'p-blocked', isBlocked: true },
    { id: 'p-relisted', isBlocked: false },
  ];
  const relistable = relistableProductIds(products, auctions);

  it('keeps blocked, deleted and already re-listed products out', () => {
    expect([...relistable]).toEqual(['p-free']);
    expect(canRelistAuction(free, relistable)).toBe(true);
    expect(canRelistAuction(blocked, relistable)).toBe(false);
    expect(canRelistAuction(relisted, relistable)).toBe(false);
    // Deleted product: no longer in /me/products.
    expect(canRelistAuction({ status: 'UNSOLD', product: product('p-gone') }, relistable)).toBe(
      false,
    );
    expect(canRelistAuction({ status: 'UNSOLD' }, relistable)).toBe(false);
  });

  it('still never relists a running auction', () => {
    expect(canRelistAuction(running, new Set(['p-relisted']))).toBe(false);
  });
});

describe('getSellerAuctionTone', () => {
  it('gives every status a tone', () => {
    for (const status of SELLER_AUCTION_STATUSES) {
      expect(getSellerAuctionTone(status)).toBeTruthy();
    }
  });

  it('reserves the live tone for a listing actually taking bids', () => {
    expect(getSellerAuctionTone('LIVE')).toBe('live');
    expect(getSellerAuctionTone('SCHEDULED')).toBe('upcoming');
    expect(getSellerAuctionTone('REJECTED')).toBe('warning');
  });
});
