# Architecture

## Overview

Feature-Based Architecture with Clean Architecture principles, running on **Next.js 16 (App Router)**. Each feature is a self-contained vertical slice with its own API, state, components, and translations. This is the storefront client for `mazad-api`, a NestJS/Prisma/MySQL auction backend in the sibling `../mazad-api` directory — see [DECISIONS.md](./DECISIONS.md) for why each piece of the stack was chosen.

## Folder Structure

```
src/
├── app/                    # Next.js App Router — wiring only, no business logic
│   ├── providers/          # QueryProvider, I18nProvider, AppProviders
│   ├── styles/globals.css  # Tailwind v4 design tokens
│   ├── layout.tsx          # Root layout (fonts, metadata, providers, theme script)
│   ├── page.tsx            # /                 → HomePage
│   ├── auctions/page.tsx   # /auctions         → AuctionsBrowsePage
│   ├── auctions/[id]/page.tsx # /auctions/:id  → AuctionDetailPage
│   ├── stores/[id]/page.tsx   # /stores/:id    → StorePage
│   ├── login/page.tsx      # /login            → LoginPage
│   ├── register/page.tsx   # /register         → RegisterPage
│   └── account/page.tsx    # /account          → AccountPage
│
├── features/               # One folder per domain feature
│   └── [feature]/
│       ├── api/            # Axios calls — only place the HTTP client is used
│       ├── components/     # Feature-scoped UI components
│       ├── constants/      # Feature constants
│       ├── hooks/          # Business logic hooks (TanStack Query, forms)
│       ├── i18n/           # en.json + ar.json + the namespace loader
│       ├── pages/          # Route-level page components
│       ├── schemas/        # Zod schemas (the source of truth for types)
│       ├── store/          # Zustand slices
│       ├── types/          # Types inferred from the schemas
│       ├── utils/          # Pure helper functions
│       └── index.ts        # Public API of the feature
│
└── shared/                 # Cross-feature code only
    ├── api/                # http-client.ts (the single Axios instance), envelope.ts
    ├── components/
    │   ├── feedback/       # ErrorBoundary, PageLoader, ErrorState, EmptyState
    │   ├── layout/         # Header, Footer, AppShell
    │   ├── cards/          # AuctionCard, AuctionGrid — used by both home and catalog
    │   └── ui/             # Button, Card, Input, Badge, Skeleton, Toaster, ...
    ├── constants/          # query-keys, routes, storage-keys
    ├── hooks/              # useLocale, useToast, useServerClock, ...
    ├── i18n/               # i18next config + common namespace
    ├── lib/                # cn(), formatMoney, formatDate, resolveAssetUrl, error helpers
    ├── store/              # locale.store.ts, toast.store.ts
    └── types/              # Shared marketplace types (AuctionSummary, Money, ...)
```

## Features

| Feature   | Owns                                                                 | Routes                                        |
| --------- | -------------------------------------------------------------------- | --------------------------------------------- |
| `auth`    | Register, login, session/token refresh, logout, route guard, account | `/login`, `/register`, `/account`             |
| `home`    | Landing feed — live, upcoming and ending-soon auctions               | `/`                                           |
| `catalog` | Category filters, auction search & detail, store pages, bid history  | `/auctions`, `/auctions/[id]`, `/stores/[id]` |

A standalone product detail route is deliberately not part of this slice: `mazad-api`'s product detail endpoint doesn't carry auction/price data, and there's no filter to look up "the auction for product X" from the products endpoint. Every product a shopper can act on already arrives embedded in its auction (`auction.product`), so the auction _is_ the browsable unit for now. Revisit this once the API links the two.

## Dependency Rules

```
app  →  features  →  shared
          ↑
     (never cross features)
```

- `features/X` must never import from `features/Y`.
- `shared` must never import from `features` or `app`.
- `app` orchestrates features via route files and imports them through their `index.ts` only.

All three rules are enforced by `no-restricted-imports` in `eslint.config.mjs`.

When two features must appear on one screen, the route file composes them — see `src/app/account/page.tsx`, which passes `auth`'s `useLogout()` and session data into the account view.

## State Management

| Concern                                   | Tool                                   |
| ----------------------------------------- | -------------------------------------- |
| Server data (fetch/cache/sync)            | TanStack Query                         |
| Global client state (auth, toast, locale) | Zustand                                |
| Form state                                | React Hook Form + `zodResolver`        |
| Local UI state                            | `useState` inside the owning component |

### Prices are strings on the wire

`mazad-api` serializes every Prisma `Decimal` (`startingPrice`, `currentPrice`, `minIncrement`,
`buyNowPrice`, `deliveryFee`) with `.toString()` — never a JSON number. Schemas type these
fields as `z.string()`; `formatMoney` (`shared/lib/money.ts`) is the only place that parses
and formats them. See [ADR-009](./DECISIONS.md#adr-009-money-is-a-decimal-string-on-the-wire-formatted-at-render-time).

### Countdowns anchor to server time

`GET /homepage` returns `serverTime`. `useServerClock` (`shared/hooks`) captures the offset
between that and `Date.now()` once per fetch; every countdown/timer reads through it instead
of trusting the client clock directly. See [ADR-013](./DECISIONS.md#adr-013-auction-countdowns-anchor-to-server-time-not-the-client-clock).

## Testing

Vitest + React Testing Library ([ADR-012](./DECISIONS.md#adr-012-vitest-and-testing-library-for-the-test-suite)).

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

Tests live beside what they cover as `*.test.ts(x)`; shared helpers are in
`src/test/`. `renderWithQuery` wraps a component in a fresh `QueryClient` with
retries off, so a failing query surfaces immediately instead of timing out.

## Routing

File-based routing via the Next.js App Router. Route files live at `src/app/<segment>/page.tsx` and do nothing but render a feature page:

```tsx
'use client';

import { AuthGuard } from '@features/auth';
import { AccountPage } from '@features/auth';

export default function Route() {
  return (
    <AuthGuard>
      <AccountPage />
    </AuthGuard>
  );
}
```

`AuthGuard` (from `features/auth`) checks the session on mount and redirects to `/login`. Middleware cannot do this today because the token lives in `localStorage` (see [ADR-008](./DECISIONS.md#adr-008-session-tokens-live-in-localstorage-behind-a-client-side-authguard)).

## i18n

- `i18next` + `react-i18next`, with namespaces lazily loaded per feature.
- Two locales: English and Arabic, matching every localized field `mazad-api` can actually serve (`resolveLocale` in the backend only recognises `en`/`ar`). Arabic is the default, RTL layout.
- Each feature owns `features/[name]/i18n/en.json` and `ar.json` and exports a loader.
- Shared strings live in `shared/i18n/common/`.
- `I18nProvider` sets `document.dir` and `document.lang` when the locale changes, and `httpClient` sends the same locale as an `Accept-Language` header on every request (see [ADR-010](./DECISIONS.md#adr-010-locale-travels-as-an-accept-language-header-not-a-query-param)).
- Pages gate their first render on `isReady` from `useXTranslation()` so keys never flash.

## Theme

- Light and dark themes, expressed as Tailwind v4 tokens in `src/app/styles/globals.css`, switched via `data-theme` (see [ADR-011](./DECISIONS.md#adr-011-two-themes-driven-by-data-theme-applied-before-hydration)).
- Theme and locale preferences persist in `localStorage` via Zustand (`shared/store`).
- All colours come from semantic tokens (`bg-surface`, `text-accent`, `text-live`, `border-destructive/30`) — components never hardcode a hex value.
