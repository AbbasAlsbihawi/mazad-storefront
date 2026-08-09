import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

export function Chip({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-foreground-soft hover:bg-surface-raised',
      )}
    >
      {children}
    </button>
  );
}
