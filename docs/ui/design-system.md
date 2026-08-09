# Design System

## Philosophy

Components follow the shadcn/ui pattern: owned source code, no black-box library. Each component is in `shared/components/ui/` and can be freely modified. Icons are inline SVG (`currentColor`, theme for free) — never emoji, which renders inconsistently across platforms.

## Color Tokens

All tokens are CSS custom properties defined in the `@theme` block of `src/app/styles/globals.css`, which makes them available as Tailwind utilities (`--color-surface` → `bg-surface`, `text-surface`, `border-surface`).

The app ships light and dark themes, switched via `data-theme` (see [dark-light-theme.md](./dark-light-theme.md) and [ADR-011](../../DECISIONS.md#adr-011-two-themes-driven-by-data-theme-applied-before-hydration)).

| Token                        | Utility                               | Usage                                      |
| ---------------------------- | ------------------------------------- | ------------------------------------------ |
| `--color-background`         | `bg-background`                       | Page background                            |
| `--color-surface`            | `bg-surface`                          | Header, cards                              |
| `--color-surface-raised`     | `bg-surface-raised`                   | Hover/raised panels                        |
| `--color-foreground`         | `text-foreground`                     | Default text                               |
| `--color-foreground-soft`    | `text-foreground-soft`                | Secondary text                             |
| `--color-muted-foreground`   | `text-muted-foreground`               | Dimmed/meta text (timestamps, counts)      |
| `--color-border`             | `border-border`                       | Hairline borders — flips with the theme    |
| `--color-primary`            | `bg-primary`                          | Primary button surface (brand gold/amber)  |
| `--color-primary-foreground` | `text-primary-foreground`             | Text on a primary-coloured surface         |
| `--color-accent`             | `text-accent`                         | Headings, current-price emphasis           |
| `--color-live`               | `bg-live` / `text-live`               | LIVE badge — an auction accepting bids now |
| `--color-info`               | `bg-info` / `text-info`               | UPCOMING badge — scheduled, not open yet   |
| `--color-warning`            | `bg-warning` / `text-warning`         | Ending within the hour                     |
| `--color-destructive`        | `bg-destructive` / `text-destructive` | Errors, danger actions, ENDED/CANCELLED    |
| `--color-ring`               | —                                     | Focus ring (applied in `:focus-visible`)   |

**Never write a hex value in a component.** The one exception is a colour that arrives at
runtime from the API (a category's icon colour, if one is ever added), which goes through an
inline `style` because Tailwind cannot generate a class for it.

## Contrast

Every foreground token above meets WCAG AA (4.5:1) against `--color-background` and `--color-surface` in both themes. `--color-primary-foreground` is chosen per-theme so text on a primary button always passes, even though the primary hue itself stays constant.

## Components

Everything lives in `shared/components/ui/` and is exported from its `index.ts`. This is the
actual set built so far — extend it only when a second consumer needs something new (see
[folder-guidelines.md](../coding/folder-guidelines.md)).

### Button

```tsx
<Button variant="default" size="default">Place bid</Button>
<Button variant="destructive" size="sm">Cancel</Button>
<Button variant="ghost" size="icon" aria-label="Close">✕</Button>
<Button size="lg" isLoading={isPending}>Signing in...</Button>
```

**Variants:** `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
**Sizes:** `default` | `sm` | `lg` | `icon`
`isLoading` sets `aria-busy` and disables the button. `type` defaults to `"button"` — pass `type="submit"` explicitly inside a form.

### Input

```tsx
<Input
  {...register('phone')}
  type="tel"
  label={t('fields.phone')}
  placeholder={t('fields.phonePlaceholder')}
  error={errors.phone ? t(errors.phone.message ?? '') : undefined}
/>
```

`label` is **required**. It is rendered and wired with `htmlFor`/`id`; pass `isLabelHidden` when the design has no room for it, which keeps it for screen readers. `error` renders a `role="alert"` message and sets `aria-invalid` and `aria-describedby`.

### Card

```tsx
<Card>
  <CardTitle>Title</CardTitle>
  <CardContent>Content goes here</CardContent>
</Card>
```

### Badge

Status pills for auctions: `<Badge tone="live">Live</Badge>`, plus `upcoming`, `warning` (ending soon), and `neutral` (ended/sold/cancelled) tones, each mapped to the color tokens above.

### Skeleton

`<Skeleton className="h-40 w-full rounded-lg" />` — a pulsing placeholder block, used in card grids while a query is pending instead of a full-page spinner.

### Toaster

`<Toaster />` is mounted once by `AppProviders`; fire messages with `useToast()`.

Dialogs, sheets, and toggle switches aren't built yet — nothing in the current feature set needs them. Add them under `shared/components/ui/` the same way, once a second feature genuinely needs one.

## Spacing

Use Tailwind spacing scale. Prefer multiples of 4 (1rem = 16px):

| Class | Size |
| ----- | ---- |
| `p-2` | 8px  |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

## Typography

```
text-xs    12px
text-sm    14px
text-base  16px
text-lg    18px
text-xl    20px
text-2xl   24px
```

Default font weight for body: `font-normal`. Headings: `font-bold` or `font-semibold`.
