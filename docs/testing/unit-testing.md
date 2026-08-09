# Unit Testing

## Setup (Vitest)

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add a `vitest.config.ts` at the project root (the app builds with Next.js, so Vitest gets its own config):

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()], // resolves @shared/, @features/, @app/
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Testing Zod Schemas

```ts
// features/auth/schemas/auth.schema.test.ts
import { loginSchema } from './auth.schema';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ phone: '+9647701234567', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ phone: '+9647701234567', password: '123' });
    expect(result.success).toBe(false);
  });
});
```

## Testing Utility Functions

```ts
// shared/lib/cn.test.ts
import { cn } from './cn';

it('merges class names', () => {
  expect(cn('px-4', 'px-6')).toBe('px-6');
});
```

## Testing Components

```tsx
// features/auth/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

it('shows validation error for an invalid phone number', async () => {
  render(<LoginForm />);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/valid phone/i);
});
```
