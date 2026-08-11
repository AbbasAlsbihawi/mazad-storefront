/**
 * Picks the one tab that owns the current route.
 *
 * A plain `pathname.startsWith(href)` lights up every ancestor: on `/account/watchlist` both the
 * Account tab (`/account`) and the Watchlist tab (`/account/watchlist`) match, so two pills go
 * active at once. Matching on a segment boundary and keeping the longest match settles it —
 * the most specific tab wins and the rest stay dark.
 *
 * The boundary rule also retires the old "/" special case: for `href === '/'` the prefix test
 * becomes `startsWith('//')`, which nothing satisfies, so home only matches itself.
 */
export function resolveActiveTabHref(hrefs: string[], pathname: string): string | undefined {
  let best: string | undefined;

  for (const href of hrefs) {
    const isMatch = pathname === href || pathname.startsWith(`${href}/`);
    if (isMatch && (best === undefined || href.length > best.length)) best = href;
  }

  return best;
}
