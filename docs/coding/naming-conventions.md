# Naming Conventions

## Files and Folders

| Type           | Convention                  | Example                  |
| -------------- | --------------------------- | ------------------------ |
| Folder         | kebab-case                  | `user-profile/`, `auth/` |
| Component      | PascalCase                  | `UserCard.tsx`           |
| Hook           | camelCase with `use` prefix | `useUsers.ts`            |
| Store          | `feature.store.ts`          | `auth.store.ts`          |
| Schema         | `feature.schema.ts`         | `user.schema.ts`         |
| Types          | `feature.types.ts`          | `user.types.ts`          |
| API module     | `feature.api.ts`            | `users.api.ts`           |
| Constants file | `feature.constants.ts`      | `auth.constants.ts`      |
| Util file      | `feature.utils.ts`          | `date.utils.ts`          |

## Variables

| Type           | Convention                 | Example                                                  |
| -------------- | -------------------------- | -------------------------------------------------------- |
| Regular        | camelCase                  | `userName`, `pageCount`                                  |
| Boolean        | `is/has/can/should` prefix | `isLoading`, `hasPermission`, `canEdit`, `shouldRefresh` |
| Event handler  | `handle` prefix            | `handleSubmit`, `handleDelete`, `handlePageChange`       |
| Constant value | UPPER_SNAKE_CASE           | `MAX_RETRY_COUNT`, `API_TIMEOUT_MS`                      |
| Enum key       | PascalCase                 | `UserRole.Admin`                                         |

## Components

```tsx
// ✅
function UserCard({ user, onDelete }: UserCardProps) {}

// ❌ — lowercase, unclear
function usercard({ data, cb }: any) {}
```

## Hooks

```ts
// ✅ — describes what it manages
function useUsers() {}
function useUserById(id: string) {}
function useCreateUser() {}

// ❌ — too generic
function useData() {}
function useFetch() {}
```

## Boolean Props

```tsx
// ✅
<Button isLoading={isPending} isDisabled={!isValid} />

// ❌
<Button loading={isPending} disabled={!isValid} />
```

(Use `is` prefix consistently for boolean props on components you own.)
