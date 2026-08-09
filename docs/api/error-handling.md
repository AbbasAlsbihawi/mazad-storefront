# Error Handling

## Levels

| Level                  | Handler                  | Scope       |
| ---------------------- | ------------------------ | ----------- |
| Component render crash | `ErrorBoundary`          | Any subtree |
| HTTP 401               | Axios interceptor        | Global      |
| HTTP 4xx/5xx           | TanStack Query `isError` | Per-query   |
| Form validation        | Zod + React Hook Form    | Per-form    |

## HTTP Errors

TanStack Query exposes `isError` and `error` from every `useQuery`:

```tsx
const { data, isLoading, isError, error } = useAuctions(filters);

if (isError) {
  return <ErrorState message={t('errors.loadFailed')} onRetry={() => void refetch()} />;
}
```

For mutations, handle in `onError`:

```ts
useMutation({
  mutationFn: authApi.login,
  onError: (error: AxiosError<ApiError>) => {
    const code = error.response?.data.errorCode;
    toast.error(t(`errors.${code}`, { defaultValue: t('errors.generic') }));
  },
});
```

## Global Error Boundary

`shared/components/feedback/ErrorBoundary.tsx` wraps the entire app in the root layout. Any uncaught render error shows a user-friendly fallback instead of a blank screen.

For nested boundaries (e.g., isolating a widget):

```tsx
<ErrorBoundary fallback={<WidgetError />}>
  <ComplexWidget />
</ErrorBoundary>
```

## ApiError Type

`mazad-api`'s `HttpExceptionFilter` returns this exact shape on every error response, success responses never look like this:

```ts
interface ApiError {
  statusCode: number;
  errorCode: string; // e.g. "INVALID_CREDENTIALS", "PHONE_EXISTS", "ADDRESS_REQUIRED"
  message: string; // human-readable — for logs, not for branching logic
  details: Record<string, unknown> | null;
  requestId: string;
  timestamp: string;
  path: string;
}
```

Type the Axios error generic as `AxiosError<ApiError>`, and branch on `errorCode`, never on
`message` — the message is free text meant for a log line, not a stable identifier, and it can
change wording without notice. Map known `errorCode` values to translated copy; fall back to a
generic translated message for anything unrecognized so a new backend error code never surfaces
raw English/technical text to a user in the Arabic UI.
