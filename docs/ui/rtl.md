# RTL / LTR Support

## Setup

`src/app/layout.tsx` ships `<html lang="ar" dir="rtl">` so the very first paint is correct. `I18nProvider` mounts `useLocale()`, which keeps both attributes in sync whenever the locale changes:

```ts
useEffect(() => {
  if (i18n.language !== locale) void i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = direction;
}, [locale, direction]);
```

`getDirection` maps `'ar'` → `'rtl'`, all others → `'ltr'`.

## Tailwind Logical Properties

Always prefer logical CSS properties for RTL-safe layouts:

| Physical (avoid) | Logical (prefer)              |
| ---------------- | ----------------------------- |
| `pl-4`           | `ps-4` (padding-inline-start) |
| `pr-4`           | `pe-4` (padding-inline-end)   |
| `ml-4`           | `ms-4` (margin-inline-start)  |
| `mr-4`           | `me-4` (margin-inline-end)    |
| `left-0`         | `start-0`                     |
| `right-0`        | `end-0`                       |
| `border-l`       | `border-s`                    |
| `rounded-l-md`   | `rounded-s-md`                |

```tsx
// ✅ — RTL safe
<div className="ps-4 border-s">...</div>

// ❌ — breaks in RTL
<div className="pl-4 border-l">...</div>
```

## Icon Mirroring

Icons that indicate direction (arrows, chevrons) need to flip in RTL. Use `rtl:rotate-180` or the `dir` attribute:

```tsx
<ChevronRight className="rtl:rotate-180" />
```

## Testing RTL

Arabic is the default, so RTL is the everyday case — the risk runs the other way. To check a change in both directions, set the locale to `en` in `localStorage` (key `locale`) and reload, then verify:

- Text alignment follows the direction
- Form inputs and labels align correctly
- Chevrons and back arrows are mirrored (`rtl:rotate-180`)
- No horizontal overflow at 320px width
- The header's nav links read in the correct order

## `useLocale` Hook

```ts
const { locale, direction, changeLocale } = useLocale();

// direction is 'ltr' | 'rtl'
// changeLocale('ar') sets dir=rtl, lang=ar
```
