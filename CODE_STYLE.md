# Code Style

## TypeScript

- `strict: true` — no exceptions.
- Never use `any`. Use `unknown` and narrow it.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Infer from Zod schemas: `type Foo = z.infer<typeof fooSchema>`.
- Use `type` keyword on all import-only type symbols: `import type { Foo }`.

## React

- Functional components only — no class components (except `ErrorBoundary`).
- One component per file.
- Use `React.forwardRef` for UI primitives that need ref forwarding.
- Never fetch data inside a component; delegate to a hook.
- Memoize only when a profiler proves it helps — no premature `useMemo`/`useCallback`.

## Client Components

Any module that uses state, effects, refs, context, browser APIs, or `next/navigation` starts with `'use client'`. In practice that is everything under `features/*/{components,hooks,pages,store}` and `shared/{components,hooks,store}`, plus each feature's `index.ts` — a barrel re-exporting client code must carry the directive too, or a server route importing it will fail to build.

Schemas, types, constants, utils, and API modules stay directive-free: they are plain TypeScript and work in either graph.

## Components

```tsx
// ✅ Good
interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const handleDelete = () => onDelete(user.id);
  return (
    <Card>
      <p>{user.name}</p>
      <Button onClick={handleDelete}>Delete</Button>
    </Card>
  );
}

// ❌ Bad — business logic inside component, prop drilling, any
export function UserCard({ data, cb }: any) {
  const [users, setUsers] = useState([]);
  useEffect(() => { fetch('/api/users').then(r => setUsers(r)); }, []);
  ...
}
```

## Hooks

```ts
// ✅ Good — single responsibility, named clearly
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.list(filters),
  });
}

// ❌ Bad — mixed concerns, vague name
export function useData() { ... }
```

## Naming

| Pattern                        | Example                                 |
| ------------------------------ | --------------------------------------- |
| Boolean: `is/has/can/should`   | `isLoading`, `hasPermission`, `canEdit` |
| Event handler: `handle` prefix | `handleSubmit`, `handleDelete`          |
| Async functions                | `fetchUser`, `loadDashboard`            |
| Constants                      | `MAX_ITEMS_PER_PAGE = 25`               |

## CSS / Tailwind

- Use `cn()` (from `@shared/lib`) to merge conditional classes.
- Tailwind utilities only. An inline `style` is acceptable for one thing: a value that arrives at runtime from data, such as a category's icon colour from the API.
- Colours come from the semantic tokens in `src/app/styles/globals.css` (`bg-surface`, `text-accent`, `border-destructive/30`). Never write a hex value in a component.
- RTL-aware: use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `border-s`, `border-e`) rather than their physical counterparts.
- Directional icons flip with `rtl:rotate-180`.

## Formatting

Enforced by Prettier (`.prettierrc`):

- Single quotes
- Trailing commas
- 100-char print width
- 2-space indent
