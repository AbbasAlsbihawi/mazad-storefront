# Hooks Guidelines

## Custom Hooks Own Business Logic

Components are display only. All logic lives in hooks.

```ts
// features/catalog/hooks/useAuctions.ts
export function useAuctions(filters: AuctionListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctions(filters),
    queryFn: () => catalogApi.listAuctions(filters),
  });
}
```

```tsx
// Component — no logic, just display
function AuctionsBrowsePage() {
  const { data, isLoading } = useAuctions(filters);
  if (isLoading) return <PageLoader />;
  return <AuctionGrid auctions={data?.data ?? []} />;
}
```

## Categories

| Category       | Example                                   | Location                 |
| -------------- | ----------------------------------------- | ------------------------ |
| Query hook     | `useAuctions`, `useAuction(id)`           | `features/[name]/hooks/` |
| Mutation hook  | `useLogin`, `useRegister`                 | `features/[name]/hooks/` |
| Form hook      | `useLoginForm`                            | `features/[name]/hooks/` |
| Shared UI hook | `useTheme`, `useLocale`, `useServerClock` | `shared/hooks/`          |

## Size Limit

Each hook should be **10–30 lines**. If a hook grows large, extract helpers or split into two hooks.

## Do Not

- Fetch data with `useEffect` + `fetch` — use TanStack Query.
- Access Zustand stores inside query hooks (keep concerns separate).
- Return raw Axios responses — always unwrap to the data type.

## Naming

| Pattern   | Correct name                                   |
| --------- | ---------------------------------------------- |
| Queries   | `useAuctions`, `useAuction(id)`, `useHomeFeed` |
| Mutations | `useLogin`, `useRegister`, `useLogout`         |
| Combined  | `useAuthActions`                               |
| Auth      | `useLogin`, `useLogout`, `useCurrentUser`      |
