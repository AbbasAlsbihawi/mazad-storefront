# E2E Testing (Playwright)

Not installed yet — this documents the recommended setup for whoever picks up end-to-end
coverage next.

## Setup

```bash
npm install -D @playwright/test
npx playwright install
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
  },
});
```

Playwright drives the real app against a real `mazad-api` — point it at a seeded database
(`npm run prisma:seed` in `../mazad-api`) so the demo accounts in its README are valid.

## Critical Paths to Test

1. Login flow (valid + invalid credentials)
2. Authenticated route redirect (`/account` while signed out → `/login`)
3. Theme toggle persists across reload
4. Language switch changes text and direction
5. Home feed loads and displays at least one live auction

## Example Test

```ts
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test('successful login redirects home', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Phone').fill('+964770000010'); // seeded Buyer 1
  await page.getByLabel('Password').fill('BuyerPass1!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/');
});

test('invalid credentials show error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Phone').fill('+964770000010');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
});
```

## RTL E2E Test

```ts
test('switching to english flips direction', async ({ page }) => {
  await page.goto('/'); // arabic + rtl by default
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});
```
