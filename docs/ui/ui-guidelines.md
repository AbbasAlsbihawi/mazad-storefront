# UI Guidelines

## Layout

A conventional responsive storefront shell — full-width header with search and nav, content
column capped at a readable max-width, footer — not a mobile app shell:

```
┌───────────────────────────────────────┐
│  Header (sticky): logo, search, nav    │
├───────────────────────────────────────┤
│                                        │
│  <main> — page content                │
│                                        │
├───────────────────────────────────────┤
│  Footer                                │
└───────────────────────────────────────┘
```

- `Header` renders the logo, primary nav (`Auctions`, plus `Sign in`/`Register` or the
  account menu depending on session state), the locale switch, and the theme toggle. It's a real
  `<header>` with a `<nav aria-label>` inside, `next/link` items, and `aria-current="page"` on
  the active one.
- `Footer` carries secondary links and is not sticky.
- `login` and `register` render inside the same `Header`/`Footer` shell — there is no separate
  "auth layout"; the forms are just narrower content in `<main>`.

## Page Structure

Every page component follows this pattern:

```tsx
'use client';

export function AuctionsBrowsePage() {
  const { t, isReady } = useCatalogTranslation();
  const { data, isPending, isError, refetch } = useAuctions(filters);

  // Gate on both the lazily loaded namespace and the query, so no raw
  // translation key is ever painted.
  if (!isReady || isPending) return <PageLoader />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  return <AuctionGrid auctions={data?.data ?? []} />;
}
```

A page component wires hooks to presentational children. It holds no fetch calls, no colour values, and no business rules. The route file (`src/app/auctions/page.tsx`) wraps it in `Header`/`Footer` via the root layout — the page itself only renders `<main>` content.

## Responsive Design

- Mobile-first: base styles for small screens, `sm:` / `md:` / `lg:` for larger.
- The content column has a max-width and is centred on wide viewports; the header and footer span full width.
- Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) so RTL keeps working.

## Loading States

Show `<PageLoader />` for full-page loads. For a grid that's refetching (e.g. changing a filter), show `<Skeleton />` cards in place of the grid instead of blanking the whole page.

## Empty States

Always show an empty state instead of nothing:

```tsx
{
  auctions.length === 0 ? (
    <div className="flex h-40 items-center justify-center text-muted-foreground">
      {t('auctions.empty')}
    </div>
  ) : (
    <AuctionGrid auctions={auctions} />
  );
}
```

## Destructive Actions

Use `variant="destructive"` for delete/cancel buttons. Confirm before irreversible actions.
