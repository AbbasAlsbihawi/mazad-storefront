# Testing Guidelines

> **Status: Vitest + React Testing Library are wired up** (see [unit-testing.md](./unit-testing.md) and [ADR-012](../../DECISIONS.md#adr-012-vitest-and-testing-library-for-the-test-suite)). Covered today: `shared/lib/money.ts`, `shared/lib/date.ts`'s `formatDuration`, the auth Zod schemas, and one `LoginForm` validation test proving the RTL + i18next + TanStack Query stack renders together. MSW-based integration tests and Playwright e2e (below) are documented as the recommended next tools, not yet installed — `npm run type-check`, `npm run lint`, `npm run build`, and `npm run test` are the checks that actually run today.
>
> Highest-value gaps to close next: `shared/hooks/useServerClock.ts` (the countdown offset logic — needs fake timers), and the `httpClient` response interceptor's refresh-token retry-once behavior (needs a mocked `axios.post` for `/auth/refresh`) — both real branching logic that a manual test pass won't catch a regression in.

## Testing Strategy

| Layer       | What to test                           | Tool (recommended)             |
| ----------- | -------------------------------------- | ------------------------------ |
| Unit        | Pure functions, utils, Zod schemas     | Vitest                         |
| Component   | Rendering, interactions, accessibility | Vitest + React Testing Library |
| Integration | Feature flows (form → API → state)     | Vitest + MSW                   |
| E2E         | Critical user paths                    | Playwright                     |

## Test File Location

Co-locate tests with the code they test:

```
features/auth/
├── hooks/
│   ├── useLogin.ts
│   └── useLogin.test.ts      ← unit test for the hook
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx    ← component test
```

## What to Test

**Always test:**

- Zod schemas (valid and invalid input)
- Utility functions with business logic
- Form validation behavior
- Key user flows (login, form submit, navigation)

**Often test:**

- Component rendering in different states (loading, error, empty, data)
- Custom hooks via `renderHook`

**Skip:**

- Simple display components with no logic
- Config files
- Type definitions

## Principles

- Test behavior, not implementation.
- One assertion per logical case.
- Avoid testing internals — test from the user's perspective.
- Mock at the network boundary (MSW), not inside the code.
