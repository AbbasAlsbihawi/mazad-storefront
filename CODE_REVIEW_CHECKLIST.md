# Code Review Checklist

## Architecture

- [ ] Feature imports only from `shared/` and itself — never from another feature
- [ ] `shared/` imports nothing from `features/` or `app/`
- [ ] `app/` imports features through `@features/<name>`, not their internals
- [ ] No business logic inside components
- [ ] Axios calls only in `features/[name]/api/`, using the shared `httpClient`
- [ ] New shared utilities don't duplicate existing ones
- [ ] `'use client'` present on every module using state, effects, browser APIs, or the router

## TypeScript

- [ ] No `any` usage
- [ ] Types inferred from Zod schemas where applicable
- [ ] `import type` used for type-only imports
- [ ] No unused variables or parameters

## Components

- [ ] Under 200 lines
- [ ] Single responsibility
- [ ] Props interface is explicit (no implicit `any`)
- [ ] Semantic HTML used (`button`, `nav`, `main`, `section`, `article`, `table`)
- [ ] No hardcoded colours — semantic tokens only
- [ ] Clickable elements are real `<button>` or `<Link>`, never a `<div>` with `onClick`

## Accessibility

- [ ] Interactive elements have accessible labels (`aria-label`, `title`, or visible text)
- [ ] Form inputs associated with `<label>` via `htmlFor`/`id`
- [ ] Error messages use `role="alert"`
- [ ] Keyboard navigation works

## i18n

- [ ] All user-visible strings use `t('key')`
- [ ] Both `en.json` and `ar.json` updated
- [ ] RTL layout is not broken

## State

- [ ] Server data comes from TanStack Query, not Zustand
- [ ] Form state managed by React Hook Form
- [ ] Loading and error states handled

## Performance

- [ ] Large lists use virtualization
- [ ] Heavy components are lazy-loaded with `next/dynamic`
- [ ] No unnecessary re-renders (verify with React DevTools)
- [ ] No new dependency added to `shared/` unless several features need it

## Gates

- [ ] `npm run type-check` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run format:check` — clean
- [ ] `npm run build` — succeeds
