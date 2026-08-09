# API Guidelines

## Rules

1. **Axios only in `api/` modules.** Never call `httpClient` from a component or hook directly.
2. **Return the data, not the response.** `.then(r => r.data)` at the API layer.
3. **Type the return value.** `httpClient.get<User>('/users/1')` — always provide the generic.
4. **Group by resource**, not by HTTP method.

## API Module Structure

`mazad-api` returns raw JSON on success — a list endpoint is `{ data, meta }`, not a bare array (see [error-handling.md](./error-handling.md) for the one wrapped shape: errors):

```ts
// features/catalog/api/catalog.api.ts
export const catalogApi = {
  listAuctions: (params: AuctionListParams) =>
    httpClient.get<unknown>('/auctions', { params }).then((r) => auctionListSchema.parse(r.data)),
  getAuction: (id: string) =>
    httpClient.get<unknown>(`/auctions/${id}`).then((r) => auctionSchema.parse(r.data)),
  getBidHistory: (id: string) =>
    httpClient.get<unknown>(`/auctions/${id}/bids`).then((r) => bidHistorySchema.parse(r.data)),
};
```

Type the raw response as `unknown` and let the Zod schema narrow it — never assert a shape with `as`.

## Query Hook Layer

API functions are never called from components. TanStack Query hooks bridge API → component:

```
Component → useAuctions() hook → catalogApi.listAuctions() → httpClient
```

## Environment Variables

| Var                   | Description                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of `mazad-api`, including its `/api/v1` prefix — e.g. `http://localhost:3001/api/v1` |

All `NEXT_PUBLIC_`-prefixed variables are exposed to the client bundle. Never put secrets here.
