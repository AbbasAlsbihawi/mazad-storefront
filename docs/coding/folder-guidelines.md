# Folder Guidelines

## When to Create a New Feature

Create `features/[name]/` when the domain concept:

- Has its own API endpoints
- Has its own pages/routes
- Has its own state
- Would be owned by a distinct team

## Feature Folder Checklist

```
features/my-feature/
├── api/            ← always (HTTP calls)
├── components/     ← if has UI components
├── constants/      ← if has feature-level constants
├── hooks/          ← always (data fetching / mutations)
├── i18n/
│   ├── en.json     ← always
│   └── ar.json     ← always
├── pages/          ← if has routes
├── schemas/        ← if has forms or API validation
├── store/          ← only if has client state beyond TQ
├── types/          ← always
├── utils/          ← if has pure helpers
└── index.ts        ← always (public API)
```

Omit folders that have no content — don't create empty placeholder directories.

## When to Move to `shared/`

Move code to `shared/` when:

- It is imported by 2+ different features.
- It has no dependency on any single feature's types.

Do NOT move to `shared/` just because something "might be reused." Wait until the second consumer exists.

## `shared/` Subfolder Rules

| Folder                        | Content                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `shared/api/`                 | The single Axios instance (`http-client.ts`)              |
| `shared/components/ui/`       | Primitives: Button, Input, Card, Badge, Skeleton, Toaster |
| `shared/components/layout/`   | Header, Footer                                            |
| `shared/components/cards/`    | AuctionCard — presentational, used by 2+ features         |
| `shared/components/feedback/` | ErrorBoundary, PageLoader, ErrorState, EmptyState         |
| `shared/hooks/`               | useLocale, useToast, useServerClock                       |
| `shared/lib/`                 | cn(), formatMoney(), date helpers, getErrorMessage()      |
| `shared/constants/`           | QUERY_KEYS, ROUTES, STORAGE_KEYS                          |
| `shared/store/`               | locale.store.ts, toast.store.ts                           |
| `shared/types/`               | ApiError, AuctionSummary, Locale, Direction               |
