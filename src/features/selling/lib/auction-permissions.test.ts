import { describe, expect, it } from 'vitest';
import {
  canCancelAuction,
  canEditAuction,
  canSubmitAuction,
  getSellerAuctionTone,
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
    for (const status of ['DRAFT', 'SCHEDULED', 'REJECTED'] as const) {
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

  it('refuses while an admin is still reviewing it', () => {
    expect(canCancelAuction({ status: 'PENDING_APPROVAL', bidCount: 0 })).toBe(false);
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
