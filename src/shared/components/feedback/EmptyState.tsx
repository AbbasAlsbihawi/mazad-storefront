import type { ReactNode } from 'react';

export interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
      <p>{message}</p>
      {action}
    </div>
  );
}
