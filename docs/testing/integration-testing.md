# Integration Testing

Not installed yet — this documents the recommended approach for the next feature that needs a
full form → API → state flow test, going beyond what `unit-testing.md`'s isolated
component/hook tests cover.

## Mock Service Worker (MSW)

Use MSW to intercept HTTP requests at the network boundary — not Axios mocks:

```bash
npm install -D msw
```

```ts
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/v1/auth/login', () =>
    HttpResponse.json({ accessToken: 't', refreshToken: 'r', sessionId: 's', user: mockUser }),
  ),
  http.get('/api/v1/homepage', () => HttpResponse.json(mockHomeFeed)),
];
```

```ts
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Testing a Feature Flow

Next.js App Router pages aren't wrapped in a router provider the way a SPA router requires —
render the feature's page component directly with `renderWithQuery` (see
[unit-testing.md](./unit-testing.md)) and mock `next/navigation`'s `useRouter` for the redirect
assertion:

```tsx
it('logs in and redirects home', async () => {
  const replace = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);

  renderWithQuery(<LoginPage />);

  await userEvent.type(screen.getByLabelText(/phone/i), '+9647701234567');
  await userEvent.type(screen.getByLabelText(/password/i), 'BuyerPass1!');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
});
```

## Override Handlers Per Test

```ts
it('shows error on login failure', async () => {
  server.use(
    http.post('/api/v1/auth/login', () =>
      HttpResponse.json(
        { statusCode: 401, errorCode: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' },
        { status: 401 },
      ),
    ),
  );
  // ...test the error UI shows the translated copy for INVALID_CREDENTIALS
});
```
