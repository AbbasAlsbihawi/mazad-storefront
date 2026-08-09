# Deployment

## Build

```bash
npm run build
```

Next.js emits to `.next/`. `npm run start` serves that output. Every route in this app is statically pre-rendered and hydrates on the client.

## Environment Variables

Inlined at build time, so a change needs a rebuild:

| Variable              | Description           | Example                   |
| --------------------- | --------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend REST API base | `https://api.example.com` |

`NEXT_PUBLIC_*` values are visible in the client bundle. Never put a secret in one.

Local development reads `.env.local`; `.env.example` documents what is required.

## Vercel (Recommended)

1. Connect the GitHub repo to Vercel.
2. Set the root directory to `frontend/`. The framework preset is detected as Next.js.
3. Add `NEXT_PUBLIC_API_URL` in Project Settings → Environment Variables.
4. Deploy.

Vercel auto-deploys on push to `main`.

## Docker

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
```

`NEXT_PUBLIC_API_URL` must be passed as a build argument — it is baked into the client bundle during `npm run build`, not read at container start.

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run format:check
      - run: npm run build
```
