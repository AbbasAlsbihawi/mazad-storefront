# Pull Request Guide

## PR Checklist

Before opening a PR, verify:

- [ ] `npm run type-check` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — builds successfully
- [ ] Both `en.json` and `ar.json` updated for new i18n keys
- [ ] RTL layout not broken (test by switching to Arabic)
- [ ] Accessibility: keyboard navigation, ARIA labels, semantic HTML

## PR Title Format

```
type(scope): short description
```

Examples:

- `feat(auth): add forgot password flow`
- `fix(catalog): correct ending-soon countdown drift`
- `docs(readme): update deployment instructions`

## PR Description Template

```md
## What

Brief description of what this PR does.

## Why

The reason for this change.

## How

Notable implementation decisions.

## Screenshots (if UI change)

Before | After

## Checklist

- [ ] type-check passes
- [ ] lint passes
- [ ] translations updated
- [ ] RTL tested
- [ ] accessibility checked
```

## Review Turnaround

- Reviewers should respond within 1 business day.
- Authors should address feedback within 1 business day.
- Approved PRs should be merged within 24 hours.

## Merge Strategy

- **Squash and merge** for feature branches (clean history on main).
- **Merge commit** for `develop → main` releases.
- Never force-push to `main` or `develop`.

## Draft PRs

Open a draft PR early for large features to get architecture feedback before the implementation is complete.
