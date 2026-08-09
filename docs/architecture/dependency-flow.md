# Dependency Flow

## Layer Diagram

```
┌─────────────────────────────────┐
│            app/                 │  Next.js App Router: providers, routes
│  (no business logic)            │
└──────────────┬──────────────────┘
               │ imports pages from
               ▼
┌──────────────────────────────────────────────┐
│                 features/                    │  Domain logic, feature state
│              auth | home | catalog            │
└──────────────┬───────────────────────────────┘
               │ imports from
               ▼
┌─────────────────────────────────┐
│           shared/               │  Cross-cutting utilities
│  ui/ | api/ | hooks/ | lib/    │
└─────────────────────────────────┘
```

## Rules

| Importer     | Can import from          | Cannot import from             |
| ------------ | ------------------------ | ------------------------------ |
| `app/`       | `features/*`, `shared/*` | —                              |
| `features/X` | `shared/*`               | `features/Y` (another feature) |
| `shared/`    | (only npm packages)      | `features/*`, `app/`           |

## Enforcement

`no-restricted-imports` in `eslint.config.mjs` enforces all three rules, plus a ban on `../../../` paths. Absolute aliases are configured in `tsconfig.json`:

```
@/         → src/
@app/      → src/app/
@features/ → src/features/
@shared/   → src/shared/
```

- Inside `src/features/**`, any `@features/*` or `@app/*` import is an error. A feature reaches its own files with relative paths, so an aliased import is cross-feature by definition.
- Inside `src/shared/**`, `@features/*` and `@app/*` are errors.
- Inside `src/app/**`, deep imports such as `@features/auth/components/LoginForm` are errors — only `@features/auth` is allowed.

## Composing Two Features on One Screen

When a screen genuinely needs two features, the route file wires them together instead of one feature importing the other. Nothing in this first slice forces that yet — `auth`, `home`, and
`catalog` each stand on their own route — but the pattern matters as soon as one does, e.g. a
future checkout screen needing both `catalog` (the order's line items) and `auth` (the buyer's
saved address):

```tsx
// hypothetical: src/app/checkout/page.tsx
'use client';

import { AuthGuard, useCurrentUser } from '@features/auth';
import { CheckoutPage } from '@features/catalog';

export default function Route() {
  const { data: user } = useCurrentUser();

  return (
    <AuthGuard>
      <CheckoutPage buyer={user} />
    </AuthGuard>
  );
}
```

`catalog` receives the buyer as a prop and never learns that `auth` exists.

## Why This Matters

- Deleting a feature is safe — only `app/routes/` references it.
- Shared code stays generic — it has no knowledge of features.
- Features are independently deployable and testable in isolation.
