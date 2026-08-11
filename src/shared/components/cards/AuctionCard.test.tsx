import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import i18n from '@shared/i18n';
import { renderWithQuery } from '@/test/render';
import { AuctionCard } from './AuctionCard';
import type { AuctionSummary } from '@shared/types';

const START = new Date('2026-08-11T12:00:00.000Z');

const AUCTION: AuctionSummary = {
  id: 'auction-1',
  status: 'LIVE',
  startingPrice: '1000.00',
  currentPrice: '1250.00',
  bidCount: 4,
  startsAt: new Date(START.getTime() - 3_600_000).toISOString(),
  endsAt: new Date(START.getTime() + 65_000).toISOString(),
  product: { id: 'product-1', nameEn: 'Gaming laptop', nameAr: 'لابتوب ألعاب', coverImage: null },
};

beforeEach(async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(START);
  await i18n.changeLanguage('en');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AuctionCard', () => {
  // The reported bug: the card read the clock once at render and never re-rendered, so the
  // overlay sat frozen on whatever time it first painted.
  it('counts the remaining time down while it is live', () => {
    renderWithQuery(<AuctionCard auction={AUCTION} />);
    expect(screen.getByText('00:01:05')).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(5000));

    expect(screen.getByText('00:01:00')).toBeInTheDocument();
    expect(screen.queryByText('00:01:05')).not.toBeInTheDocument();
  });

  it('drops the countdown once the auction runs out', () => {
    renderWithQuery(<AuctionCard auction={AUCTION} />);

    act(() => void vi.advanceTimersByTime(70_000));

    // Whole-card re-render, not just the digits: a card must never sit at 00:00:00 still
    // presenting itself as counting down.
    expect(screen.queryByText(/00:00:0/)).not.toBeInTheDocument();
  });

  it('shows no countdown on an auction that is not live', () => {
    renderWithQuery(<AuctionCard auction={{ ...AUCTION, status: 'ENDED' }} />);

    expect(screen.queryByText('00:01:05')).not.toBeInTheDocument();
  });
});
