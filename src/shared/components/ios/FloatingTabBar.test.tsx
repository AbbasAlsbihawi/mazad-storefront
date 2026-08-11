import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingTabBar } from './FloatingTabBar';
import type { TabBarItem } from './TabBar';

// The bar reads the current route straight from next/navigation, which has no App Router context
// in a plain RTL render (see docs/testing/integration-testing.md).
const mockPathname = vi.hoisted(() => vi.fn<() => string>());
vi.mock('next/navigation', () => ({ usePathname: mockPathname }));

// The real five roots. Account nests three of the others under it, which is exactly the shape
// that used to light two pills at once — a trimmed-down fixture would hide the bug.
const ITEMS: TabBarItem[] = [
  { href: '/', label: 'Home', icon: 'house' },
  { href: '/auctions', label: 'Browse', icon: 'layout-grid' },
  { href: '/account/bids', label: 'My bids', icon: 'gavel' },
  { href: '/account/watchlist', label: 'Watchlist', icon: 'heart', badge: 3 },
  { href: '/account', label: 'Account', icon: 'user-round' },
];

function renderBar(pathname: string) {
  mockPathname.mockReturnValue(pathname);
  return render(<FloatingTabBar items={ITEMS} label="Main navigation" />);
}

/** The label of every tab currently marked as the current page. */
function activeLabels(): string[] {
  return screen
    .getAllByRole('link')
    .filter((tab) => tab.getAttribute('aria-current') === 'page')
    .map((tab) => tab.getAttribute('aria-label') ?? '');
}

describe('FloatingTabBar', () => {
  it('names every icon-only tab, since none of them carry visible text', () => {
    renderBar('/');

    for (const item of ITEMS) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('title', item.label);
    }
  });

  it('marks exactly one tab as current, whichever route is open', () => {
    for (const pathname of ['/', '/auctions', '/account', '/account/bids', '/account/watchlist']) {
      const { unmount } = renderBar(pathname);
      expect(activeLabels()).toHaveLength(1);
      unmount();
    }
  });

  // The regression from the first cut: /account prefix-matched /account/watchlist, so the
  // Account pill lit up alongside the Watchlist one.
  it('lights the most specific tab and not its ancestor', () => {
    renderBar('/account/watchlist');

    expect(activeLabels()).toEqual(['Watchlist']);
  });

  it('hands a route no tab owns outright to the closest ancestor', () => {
    renderBar('/account/orders');

    expect(activeLabels()).toEqual(['Account']);
  });

  it('never lets home swallow another root', () => {
    renderBar('/auctions');

    expect(activeLabels()).toEqual(['Browse']);
  });

  it('renders a badge as a dot rather than the count it was given', () => {
    const { container } = renderBar('/');

    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.bg-destructive')).toHaveLength(1);
  });
});
