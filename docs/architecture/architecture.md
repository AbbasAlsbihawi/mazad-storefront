# Architecture Overview

## Philosophy

This codebase follows **Feature-Based Architecture** with **Clean Architecture** principles.

The central idea: each domain concept (auth, home, catalog) is a self-contained vertical slice. A feature owns its own API calls, state, UI components, validation logic, and translations. Nothing leaks between features.

## Layers

### 1. `app/` — Application Shell

The Next.js App Router. Orchestrates the application without containing business logic.

- Providers (ErrorBoundary, React Query, i18n, Toaster)
- File-based route definitions (`app/<segment>/page.tsx`)
- Root layout: fonts, metadata, `<html lang dir>`
- Global styles and design tokens

### 2. `features/` — Domain Features

Each feature is a module with a public API (`index.ts`) and internal implementation.

Modules within a feature:

| Folder        | Responsibility                  |
| ------------- | ------------------------------- |
| `api/`        | HTTP calls via Axios            |
| `components/` | Feature-scoped UI               |
| `constants/`  | Feature-level constants         |
| `hooks/`      | Business logic + TanStack Query |
| `i18n/`       | Translation files (en + ar)     |
| `pages/`      | Route-level components          |
| `schemas/`    | Zod schemas + inferred types    |
| `store/`      | Zustand slices                  |
| `types/`      | TypeScript interfaces           |
| `utils/`      | Pure helper functions           |

### 3. `shared/` — Cross-Cutting Utilities

Only code that is genuinely needed by multiple features belongs here. When in doubt, keep it in the feature.

## Data Flow

```
User action
  → Component calls hook
    → Hook calls TanStack Query / Zustand action
      → Query calls API function
        → Axios sends HTTP request
          → Response updates Query cache
            → Component re-renders
```

## Key Constraints

1. Features do not import from each other.
2. `shared/` has no knowledge of any feature.
3. All HTTP traffic goes through the single `httpClient` instance.
4. All form validation uses Zod schemas.
5. All user-visible strings are translated (no hardcoded UI text).
