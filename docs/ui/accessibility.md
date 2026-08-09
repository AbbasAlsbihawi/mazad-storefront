# Accessibility

## Semantic HTML

Use the correct HTML element for its purpose:

```tsx
// ✅
<button onClick={handleDelete}>Delete</button>
<nav aria-label="Sidebar navigation">...</nav>
<main role="main">...</main>
<article>...</article>

// ❌ — div soup
<div onClick={handleDelete}>Delete</div>
<div class="nav">...</div>
```

## Forms

Every input must have an associated label:

```tsx
// ✅
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ — no association
<p>Email</p>
<input type="email" />
```

## Error Messages

Use `role="alert"` so screen readers announce errors immediately:

```tsx
{
  error ? (
    <p className="text-destructive" role="alert">
      {error}
    </p>
  ) : null;
}
```

## Keyboard Navigation

- All interactive elements must be reachable by Tab.
- Custom interactive elements need `tabIndex={0}` and keyboard event handlers.
- Modal dialogs trap focus inside (use Radix UI `Dialog` for this).

## ARIA

Add `aria-label` when the accessible name isn't clear from visible content:

```tsx
<Button aria-label={t('theme.dark')} size="icon">
  <MoonIcon />
</Button>
```

Use `aria-busy` on loading states:

```tsx
<button aria-busy={isPending}>Submit</button>
```

## Color Contrast

All text on background must meet WCAG AA (4.5:1 ratio). The default palette in `globals.css` is designed to pass. Test with browser DevTools or axe.

## Focus Visible

The default Tailwind v4 focus ring (`focus-visible:ring-2`) is preserved on all interactive elements. Do not suppress it with `outline-none` without replacing it.
