# React Guidelines

## Functional Components Only

No class components (exception: `ErrorBoundary` which requires class syntax).

## Component Anatomy

```tsx
// 1. Types
interface Props { ... }

// 2. Component function
export function ComponentName({ prop1, prop2 }: Props) {
  // 3. All hooks at the top (Rules of Hooks)
  const { t } = useTranslation();
  const { data } = useQuery(...);
  const [localState, setLocalState] = useState(false);

  // 4. Derived values
  const displayName = user?.name ?? t('common.anonymous');

  // 5. Handlers
  const handleClick = () => { ... };

  // 6. Early returns (loading/error states)
  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorMessage />;

  // 7. Main render
  return (...);
}
```

## Memoization

Only memoize when you have measured a real performance problem:

```ts
// ✅ Memoize an expensive pure computation
const sortedUsers = useMemo(() => [...users].sort(byName), [users]);

// ❌ Premature — identity check is cheaper than memo overhead
const label = useMemo(() => t('common.submit'), [t]);
```

## Effects

`useEffect` is for synchronizing with external systems (DOM, subscriptions, timers). It is **not** for fetching data (use TanStack Query).

```ts
// ✅ — syncing with DOM
useEffect(() => {
  document.title = pageTitle;
}, [pageTitle]);

// ❌ — use useQuery instead
useEffect(() => {
  fetch('/api/users')
    .then((r) => r.json())
    .then(setUsers);
}, []);
```

## Key Prop

Always use stable, unique keys — never array index for lists that can be reordered or filtered:

```tsx
// ✅
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ❌
{
  users.map((user, i) => <UserCard key={i} user={user} />);
}
```

## Lazy Loading

Lazy-load page-level components to reduce initial bundle:

```ts
const UsersPage = lazy(() =>
  import('@features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
);
```
