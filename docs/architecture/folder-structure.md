# Folder Structure

```
src/
├── app/                              # Next.js App Router — wiring only
│   ├── providers/
│   │   ├── AppProviders.tsx          # ErrorBoundary + Query + i18n + Toaster
│   │   ├── I18nProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css               # Tailwind v4 @theme design tokens
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # /
│   ├── auctions/page.tsx             # /auctions
│   ├── auctions/[id]/page.tsx        # /auctions/:id
│   ├── stores/[id]/page.tsx          # /stores/:id
│   ├── login/page.tsx                # /login
│   ├── register/page.tsx             # /register
│   └── account/page.tsx              # /account
│
├── features/
│   ├── auth/
│   │   ├── api/auth.api.ts
│   │   ├── components/               # AuthGuard, LoginForm, RegisterForm, ...
│   │   ├── hooks/                    # useLogin, useRegister, useLogout, useCurrentUser, ...
│   │   ├── i18n/                     # en.json, ar.json, index.ts (loader)
│   │   ├── pages/                    # LoginPage, RegisterPage, AccountPage
│   │   ├── schemas/auth.schema.ts
│   │   ├── store/auth.store.ts
│   │   ├── types/auth.types.ts
│   │   └── index.ts
│   │
│   ├── home/                         # Landing feed only — no schemas/store needed
│   │   ├── api/home.api.ts
│   │   ├── components/               # LiveSection, UpcomingSection, EndingSoonSection
│   │   ├── hooks/useHomeFeed.ts
│   │   ├── i18n/
│   │   ├── pages/HomePage.tsx
│   │   ├── types/home.types.ts
│   │   └── index.ts
│   │
│   └── catalog/                      # Categories, auction search/detail, stores
│       ├── api/catalog.api.ts
│       ├── components/               # CategoryChips, AuctionFilters, BidHistory, ...
│       ├── hooks/                    # useCategories, useAuctions, useAuction, useStore, ...
│       ├── i18n/
│       ├── pages/                    # AuctionsBrowsePage, AuctionDetailPage, StorePage
│       ├── schemas/catalog.schema.ts
│       ├── types/catalog.types.ts
│       └── index.ts
│
└── shared/
    ├── api/
    │   ├── http-client.ts            # Axios instance (single source)
    │   └── index.ts
    ├── components/
    │   ├── feedback/                 # ErrorBoundary, PageLoader, ErrorState, EmptyState
    │   ├── layout/                   # Header, Footer
    │   ├── cards/                    # AuctionCard, AuctionGrid — shared by home and catalog
    │   └── ui/                       # Button, Input, Card, Badge, Skeleton, Toaster
    ├── constants/
    │   ├── query-keys.ts
    │   ├── routes.ts
    │   ├── storage-keys.ts
    │   └── index.ts
    ├── hooks/
    │   ├── useLocale.ts
    │   ├── useNamespaceTranslation.ts
    │   ├── useServerClock.ts
    │   ├── useToast.ts
    │   └── index.ts
    ├── i18n/
    │   ├── common/{en,ar}.json
    │   ├── config.ts
    │   └── index.ts
    ├── lib/
    │   ├── cn.ts
    │   ├── money.ts
    │   ├── date.utils.ts
    │   ├── error.utils.ts
    │   └── index.ts
    ├── store/
    │   ├── locale.store.ts
    │   ├── toast.store.ts
    │   └── index.ts
    └── types/
        ├── marketplace.types.ts      # AuctionSummary, Money, PaginatedResponse<T>, ...
        └── index.ts
```

## Key Rules

- `app/` has no business logic — only wiring. A route file renders a feature page and nothing else.
- `features/X/index.ts` is the only public interface of a feature. `app/` imports `@features/x`, never `@features/x/components/Thing`.
- Anything imported by 2+ features belongs in `shared/`.
- `shared/` never imports `features/` or `app/`. Where shared code needs feature-specific data, the feature passes it in (see the i18n loader in [ADR-007](../../DECISIONS.md#adr-007-features-own-their-translations-shared-owns-the-loader)).
