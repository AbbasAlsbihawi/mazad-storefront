# Performance

## Code Splitting

Next.js splits by route segment automatically — each `app/<segment>/page.tsx` is its own chunk. Split further only for genuinely heavy components:

```ts
// features/catalog/pages/AuctionDetailPage.tsx — the image lightbox is below the fold
const ImageLightbox = dynamic(
  () => import('../components/ImageLightbox').then((module) => module.ImageLightbox),
  { ssr: false },
);
```

Translation bundles are split the same way: each feature dynamic-imports its own `en.json`/`ar.json` on first use ([ADR-006](../DECISIONS.md#adr-006-i18next-lazy-loaded-feature-namespaces-english--arabic-only)/[ADR-007](../DECISIONS.md#adr-007-features-own-their-translations-shared-owns-the-loader)), so the `catalog` strings never ship with `/login`.

## TanStack Query Caching

- `staleTime: 60_000` — data considered fresh for 1 minute (avoids refetch on navigation).
- `refetchOnWindowFocus: false` — no surprise refetches.
- Use `keepPreviousData` on paginated lists to avoid loading flicker on page change.

## Bundle Analysis

Next.js chunks vendor code on its own; there is no manual chunk map to maintain. To inspect what a route actually ships, read the route table printed by `npm run build`, or add `@next/bundle-analyzer` when a regression needs investigating.

Keep the shared chunk honest: a dependency imported by `shared/` lands in every route, so think twice before putting one there.

## Virtualization

For lists with >100 items, use `@tanstack/virtual`:

```ts
const virtualizer = useVirtualizer({
  count: auctions.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 64,
});
```

## Memoization

Only memoize when profiling shows a bottleneck:

- `useMemo` — expensive derived computations
- `useCallback` — stable callbacks passed to heavy child components
- `React.memo` — components that receive stable props but re-render from parent

Never memoize as a default.

## Prefetching

Prefetch likely-needed data on hover using TanStack Query:

```ts
const queryClient = useQueryClient();

const handleHover = () => {
  void queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.catalog.auction(auctionId),
    queryFn: () => catalogApi.getAuction(auctionId),
  });
};
```
