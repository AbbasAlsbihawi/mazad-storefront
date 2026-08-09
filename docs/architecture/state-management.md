# State Management

## Decision Matrix

| State Type              | Tool                   | Where                               |
| ----------------------- | ---------------------- | ----------------------------------- |
| Remote/server data      | TanStack Query         | `features/[name]/hooks/`            |
| Auth token + user       | Zustand + localStorage | `features/auth/store/auth.store.ts` |
| UI preferences (locale) | Zustand (persisted)    | `shared/store/locale.store.ts`      |
| Transient feedback      | Zustand                | `shared/store/toast.store.ts`       |
| Form values             | React Hook Form        | Inside form components              |
| Local UI state          | `useState`             | The component that owns it          |

## TanStack Query

All queries and mutations live in feature hooks. Components never call the API directly.

```ts
// features/catalog/hooks/useAuctions.ts
export function useAuctions(filters: AuctionListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.auctions(filters),
    queryFn: () => catalogApi.listAuctions(filters),
    staleTime: 30_000,
  });
}
```

Query keys are centralized in `shared/constants/query-keys.ts` to prevent typos and enable targeted invalidation.

## Zustand

Only used for client-only state that must survive navigation (auth session, theme preference).

```ts
// shared/store/locale.store.ts
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'locale' },
  ),
);
```

**Never** put API response data into Zustand. That is what TanStack Query's cache is for.

## React Hook Form

All forms are controlled by React Hook Form with Zod resolvers.

```ts
const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
});
```

Keep form submission logic out of components — use a mutation hook and call `mutate()` in `onSubmit`.
