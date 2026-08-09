# TanStack Query

## Setup

Configured in `app/providers/QueryProvider.tsx`:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute default
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
```

## Query Keys

All keys are defined in `shared/constants/query-keys.ts`:

```ts
export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  catalog: {
    categories: ['catalog', 'categories'] as const,
    auctions: (filters: AuctionListParams) => ['catalog', 'auctions', filters] as const,
    auction: (id: string) => ['catalog', 'auctions', id] as const,
  },
} as const;
```

Using factory functions ensures consistent keys and enables targeted invalidation.

## Queries

```ts
// features/catalog/hooks/useAuction.ts
export function useAuction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auction(id),
    queryFn: () => catalogApi.getAuction(id),
    enabled: !!id,
  });
}
```

## Mutations

```ts
// features/auth/hooks/useLogin.ts
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (values: LoginValues) => authApi.login(values),
    onSuccess: (result) => setSession(result),
  });
}
```

## Pagination

For paginated lists (`mazad-api` returns `{ data, meta: { page, limit, total, totalPages } }`),
use `placeholderData: keepPreviousData` to avoid loading flicker between pages:

```ts
return useQuery({
  queryKey: QUERY_KEYS.catalog.auctions({ page, limit }),
  queryFn: () => catalogApi.listAuctions({ page, limit }),
  placeholderData: keepPreviousData,
});
```
