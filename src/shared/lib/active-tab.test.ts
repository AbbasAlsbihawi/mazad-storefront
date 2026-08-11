import { describe, expect, it } from 'vitest';
import { resolveActiveTabHref } from './active-tab';

// The app's five roots, in the order AppTabBar declares them.
const TABS = ['/', '/auctions', '/account/bids', '/account/watchlist', '/account'];

describe('resolveActiveTabHref', () => {
  it('gives a nested route to the most specific tab, not its ancestor', () => {
    // The regression from the floating bar: /account also prefix-matched, so two pills lit up.
    expect(resolveActiveTabHref(TABS, '/account/watchlist')).toBe('/account/watchlist');
    expect(resolveActiveTabHref(TABS, '/account/bids')).toBe('/account/bids');
  });

  it('falls back to the ancestor when no tab owns the route outright', () => {
    expect(resolveActiveTabHref(TABS, '/account/orders')).toBe('/account');
    expect(resolveActiveTabHref(TABS, '/account/addresses')).toBe('/account');
  });

  it('matches a tab exactly', () => {
    expect(resolveActiveTabHref(TABS, '/account')).toBe('/account');
    expect(resolveActiveTabHref(TABS, '/auctions')).toBe('/auctions');
    expect(resolveActiveTabHref(TABS, '/')).toBe('/');
  });

  it('never lets home swallow another route', () => {
    expect(resolveActiveTabHref(TABS, '/auctions')).not.toBe('/');
    expect(resolveActiveTabHref(TABS, '/account')).not.toBe('/');
  });

  it('only matches whole segments', () => {
    // /accounts is a different route from /account and must not activate the Account tab.
    expect(resolveActiveTabHref(TABS, '/accounts')).toBeUndefined();
    expect(resolveActiveTabHref(TABS, '/auctions-archive')).toBeUndefined();
  });

  it('returns nothing for a route no tab owns', () => {
    expect(resolveActiveTabHref(TABS, '/login')).toBeUndefined();
  });
});
