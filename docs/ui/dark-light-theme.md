# Dark / Light Theme

## How It Works

1. `:root` carries the **dark** token values by default; `[data-theme='light']` overrides them.
2. A `next/script` with `strategy="beforeInteractive"` in the root layout reads the saved
   preference from `localStorage` and stamps `data-theme` (plus `lang`/`dir`) on `<html>` before
   React hydrates — so there's no flash of the wrong palette on first paint.
3. `useTheme` (`shared/hooks`) toggles `data-theme` after mount and persists the choice via
   `shared/store/theme.store.ts` (Zustand + `localStorage`).

See [ADR-011](../../DECISIONS.md#adr-011-two-themes-driven-by-data-theme-applied-before-hydration) for why this runs as a pre-hydration script instead of a `useEffect`, and why it's `data-theme`
rather than a `.dark` class.

## Two Modes

There is no "system" auto-detect mode — just an explicit toggle between `light` and `dark`,
persisted per visitor:

| Mode    | Behavior                                                      |
| ------- | ------------------------------------------------------------- |
| `light` | `<html data-theme="light">`                                   |
| `dark`  | `<html>` with no `data-theme` attribute (the `:root` default) |

## CSS Variables

Colors are defined as CSS custom properties in `globals.css`:

```css
:root {
  --color-background: oklch(0.16 0.01 260);
  --color-primary: oklch(0.78 0.14 85);
  /* ...full token list in docs/ui/design-system.md */
}

[data-theme='light'] {
  --color-background: oklch(0.98 0.005 260);
  --color-primary: oklch(0.62 0.15 85);
}
```

Tailwind v4 maps these via `@theme inline` in the same file:

```css
@theme inline {
  --color-background: var(--color-background);
  --color-primary: var(--color-primary);
}
```

Components use semantic Tailwind utilities (`bg-background`, `text-foreground`) — they adapt automatically to the active theme. Never hardcode a hex/oklch value in a component.

## Toggling Theme

```tsx
const { theme, setTheme } = useTheme();

setTheme('dark');
setTheme('light');
```

The toggle button lives in `Header` (`shared/components/layout/Header.tsx`).

## Adding a Custom Color Token

1. Add the variable to both `:root` and `[data-theme='light']` in `globals.css`.
2. Map it in the `@theme inline` block.
3. Use it as `bg-{name}` / `text-{name}` / `border-{name}` — never introduce a raw Tailwind color class alongside the token system.
