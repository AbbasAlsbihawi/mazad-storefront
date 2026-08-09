# TypeScript Guidelines

## Strict Mode

`tsconfig.json` has `"strict": true`. No exceptions. This enables:

- `strictNullChecks`
- `noImplicitAny`
- `strictFunctionTypes`
- `strictPropertyInitialization`

`noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are on as well. `next.config.mjs` must never set `typescript.ignoreBuildErrors` — the build is a real type gate.

## Never Use `any`

ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`.

```ts
// ✅ — narrow unknown
function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// ❌
function parseError(error: any): string {
  return error.message;
}
```

## Infer From Zod

```ts
// schema first — mazad-api logs in with phone + password, not email
const loginSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  password: z.string().min(8),
});

// type inferred — no duplication
type LoginFormValues = z.infer<typeof loginSchema>;
```

## Prefer `interface` for Object Shapes

```ts
// ✅
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions, intersections, mapped types
type UserRole = 'admin' | 'editor' | 'viewer';
type UserWithRole = User & { role: UserRole };
```

## Generic Constraints

```ts
// ✅ — constrained generic
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

## Discriminated Unions for State

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## `as const` for Literal Inference

```ts
const ROLES = ['admin', 'editor', 'viewer'] as const;
type UserRole = (typeof ROLES)[number]; // 'admin' | 'editor' | 'viewer'
```
