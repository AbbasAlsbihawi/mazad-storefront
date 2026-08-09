# Import Guidelines

## Order

```ts
// 1. React (first always)
import { useState, useCallback } from 'react';

// 2. External libraries (alphabetical)
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 3. Shared utilities and components
import { Button } from '@shared/components/ui/Button';
import { cn } from '@shared/lib/cn';
import type { PaginationParams } from '@shared/types';

// 4. Feature-internal (relative — keep shallow)
import { usersApi } from '../api/users.api';
import type { User } from '../types/user.types';
```

## Path Aliases

Never use deep relative paths (`../../..`). Use configured aliases:

| Alias        | Resolves to     |
| ------------ | --------------- |
| `@/`         | `src/`          |
| `@app/`      | `src/app/`      |
| `@features/` | `src/features/` |
| `@shared/`   | `src/shared/`   |

```ts
// ✅
import { httpClient } from '@shared/api/http-client';
import { AuctionCard } from '@shared/components/cards';

// ❌
import { httpClient } from '../../../shared/api/http-client';
```

## Type Imports

Use `import type` for imports that are type-only. This is enforced by ESLint:

```ts
// ✅
import type { User } from '../types/user.types';
import { type UserRole } from '../types/user.types'; // inline type

// ❌ — treated as value import by bundler
import { User } from '../types/user.types';
```

## Feature Public API

Import from a feature's `index.ts`, not its internals:

```ts
// ✅
import { LoginPage } from '@features/auth';

// ❌ — bypasses the feature's public API contract
import { LoginPage } from '@features/auth/pages/LoginPage';
```
