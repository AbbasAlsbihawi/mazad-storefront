import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@shared/i18n';
import { AppTabBar } from './AppTabBar';

// The bar reads the current route straight from next/navigation, which has no App Router context
// in a plain RTL render (see docs/testing/integration-testing.md).
const mockPathname = vi.hoisted(() => vi.fn<() => string>());
vi.mock('next/navigation', () => ({ usePathname: mockPathname }));

function renderBar(pathname: string, outbidCount?: number) {
  mockPathname.mockReturnValue(pathname);
  return render(
    <I18nextProvider i18n={i18n}>
      <AppTabBar outbidCount={outbidCount} />
    </I18nextProvider>,
  );
}

/** The visible label of every tab currently marked as the current page. */
function activeLabels(): string[] {
  return screen
    .getAllByRole('link')
    .filter((tab) => tab.getAttribute('aria-current') === 'page')
    .map((tab) => tab.textContent ?? '');
}

describe('AppTabBar', () => {
  it('shows the five roots, each with a visible label', async () => {
    await i18n.changeLanguage('en');
    renderBar('/');

    for (const label of ['Home', 'Browse', 'My bids', 'Watchlist', 'Account']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('marks exactly one tab as current, whichever route is open', async () => {
    await i18n.changeLanguage('en');
    for (const pathname of ['/', '/auctions', '/account', '/account/bids', '/account/watchlist']) {
      const { unmount } = renderBar(pathname);
      expect(activeLabels()).toHaveLength(1);
      unmount();
    }
  });

  // /account prefix-matches /account/watchlist; only the most specific tab may light up.
  it('lights the most specific tab and not its ancestor', async () => {
    await i18n.changeLanguage('en');
    renderBar('/account/watchlist');
    expect(activeLabels()).toEqual(['Watchlist']);
  });

  it('hands a route no tab owns outright to the closest ancestor', async () => {
    await i18n.changeLanguage('en');
    renderBar('/account/orders');
    expect(activeLabels()).toEqual(['Account']);
  });

  it('never lets home swallow another root', async () => {
    await i18n.changeLanguage('en');
    renderBar('/auctions');
    expect(activeLabels()).toEqual(['Browse']);
  });

  it('puts the outbid count on My bids', async () => {
    await i18n.changeLanguage('en');
    renderBar('/', 2);
    expect(screen.getByRole('link', { name: /My bids/ })).toHaveTextContent('2');
  });
});
