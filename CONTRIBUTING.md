# Contributing

## Development Setup

`frontend/` and `../mazad-api/` are sibling projects in the same workspace. The API must be running for anything beyond the login/register screens to show real data.

```bash
# 1. Backend (see ../mazad-api/README.md for full setup)
cd ../mazad-api
cp .env.example .env   # OTP_DEV_MODE=true accepts the static code 1111 — no real SMS/WhatsApp needed
npm install
npm run prisma:generate && npm run prisma:migrate:dev && npm run prisma:seed
npm run dev             # http://localhost:3001/api/v1

# 2. Frontend
cd ../frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
npm run dev              # http://localhost:5173
```

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Development server                       |
| `npm run build`        | Production build (also type-checks)      |
| `npm run start`        | Serve the production build               |
| `npm run type-check`   | `tsc --noEmit`                           |
| `npm run lint`         | ESLint, including the architecture rules |
| `npm run lint:fix`     | ESLint with `--fix`                      |
| `npm run format`       | Prettier write                           |
| `npm run format:check` | Prettier check (CI)                      |
| `npm run test`         | Vitest, single run                       |
| `npm run test:watch`   | Vitest, watch mode                       |

## Branch Strategy

| Branch            | Purpose               |
| ----------------- | --------------------- |
| `main`            | Production-ready code |
| `develop`         | Integration branch    |
| `feat/<name>`     | New features          |
| `fix/<name>`      | Bug fixes             |
| `docs/<name>`     | Documentation only    |
| `refactor/<name>` | Refactoring           |

All work branches off `develop`. PRs target `develop` (only `develop → main` for releases).

## Before Opening a PR

- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run format:check` passes
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes
- [ ] Both `en.json` and `ar.json` updated for any new i18n keys
- [ ] Feature is accessible (keyboard navigation, ARIA labels)
- [ ] RTL layout tested if UI changes were made (Arabic is the default locale)
- [ ] Prices rendered through `formatMoney`, never a raw string or a re-parsed number

## PR Guidelines

- One feature or fix per PR — no bundled unrelated changes.
- Keep PRs under 400 lines of diff where possible.
- Fill in the PR template completely.
- Reference the related issue with `Closes #<number>`.

## Commit Format

```
type(scope): short description (max 72 chars)

Optional longer body.

Closes #123
```

Types: `feat` | `fix` | `refactor` | `perf` | `docs` | `style` | `test` | `chore`

## Adding a New Feature

1. Create `src/features/<feature-name>/` with the subfolders it needs.
2. Add `i18n/en.json`, `i18n/ar.json`, and `i18n/index.ts` exporting the namespace loader.
3. Add `hooks/use<Feature>Translation.ts` wrapping `useNamespaceTranslation`.
4. Update `shared/constants/query-keys.ts` if new queries are added.
5. Export the public API from `index.ts`.
6. Add the route file at `src/app/<segment>/page.tsx`, wrapped in `<AuthGuard>` if it needs a session.

There is no central namespace registry to update — the feature owns its loader (ADR-007).

## Code Review

See [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md).
