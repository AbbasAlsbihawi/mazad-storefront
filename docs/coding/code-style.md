# Code Style

## Tooling

| Tool       | Config file                                         | Purpose                                    |
| ---------- | --------------------------------------------------- | ------------------------------------------ |
| ESLint     | `eslint.config.mjs`                                 | Code quality, TS rules, architecture rules |
| Prettier   | `.prettierrc`                                       | Formatting                                 |
| TypeScript | `tsconfig.json`                                     | Type checking                              |
| Tailwind   | `postcss.config.mjs` + `src/app/styles/globals.css` | Styling and design tokens                  |

## Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

## ESLint Rules (Key)

- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/consistent-type-imports: error`
- `no-console: warn` (only `console.warn`/`console.error` allowed)
- `react-hooks/rules-of-hooks: error`
- `react-hooks/exhaustive-deps: warn`

## Functions

- Max **40 lines** per function.
- Single purpose — if you need to write "and" in the function name, split it.
- Prefer named `function` declarations for components and hooks (better stack traces).
- Use arrow functions for callbacks and inline handlers.

## Comments

Write comments only when the **why** is non-obvious. Code should explain **what**; comments explain **why**.

```ts
// ✅ — explains a non-obvious constraint
// onSettled instead of onSuccess so cleanup runs even when the API is down
onSettled: () => {
  clearAuth();
  navigate('/login');
};

// ❌ — restates the code
// sets isLoading to true
setIsLoading(true);
```

## No Magic Numbers

```ts
// ✅
const MAX_FILE_SIZE_MB = 5;

// ❌
if (file.size > 5_242_880) { ... }
```
