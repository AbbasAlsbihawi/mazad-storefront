# Component Guidelines

## One Component, One Responsibility

Each component file has a single, well-named purpose. If you need to add a second distinct concern, create a second component.

## Size Limits

- **150–200 lines maximum** per component file.
- If a component grows beyond that, extract sub-components or move logic to a hook.

## Structure

```tsx
// 1. Imports
import type { User } from '../types/user.types';
import { Button } from '@shared/components/ui/Button';

// 2. Types / Interfaces
interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

// 3. Component
export function UserCard({ user, onDelete }: UserCardProps) {
  // 4. Hooks (all at the top)
  const { t } = useTranslation('users');

  // 5. Derived values / handlers
  const handleDelete = () => onDelete(user.id);

  // 6. Render
  return (
    <article className="rounded-lg border p-4">
      <h3>{user.name}</h3>
      <Button variant="destructive" onClick={handleDelete}>
        {t('actions.delete')}
      </Button>
    </article>
  );
}
```

## Rules

- **No direct API calls in components.** Use query hooks.
- **No business logic in render.** Extract to hooks or utils.
- **Prefer semantic HTML** (`article`, `section`, `nav`, `header`, `main`, `aside`).
- **All user-visible text must be translated.**
- **No hardcoded colors** — use Tailwind semantic tokens (`text-destructive`, `bg-primary`).

## Props

- Keep prop interfaces small (≤5 props before considering composition).
- Use `children: ReactNode` for slot composition.
- Never pass entire store objects as props — select the minimum needed.

## Compound Components

For complex UI with shared state (Tabs, Accordion, Select):

```tsx
// Composition pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>content</CardContent>
</Card>
```
