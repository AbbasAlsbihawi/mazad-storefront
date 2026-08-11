import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

export interface ChipProps {
  isActive: boolean;
  onClick: () => void;
  /** Result count shown after the label, already localized by the caller. */
  count?: ReactNode;
  children: ReactNode;
}

/**
 * Chip — scrolling filter pill. Active fills with the brand accent; inactive is a white pill
 * carrying the card shadow, so a row of chips reads as objects on the grouped background.
 */
export function Chip({ isActive, onClick, count, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'inline-flex h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-subhead',
        'transition-[background-color,color] duration-fast ease-ios',
        isActive
          ? 'bg-primary font-semibold text-primary-foreground'
          : 'bg-surface font-medium text-foreground-soft shadow-card hover:bg-surface-raised active:bg-surface-raised',
      )}
    >
      {children}
      {count != null ? (
        <span className="text-caption-2 font-semibold opacity-70">{count}</span>
      ) : null}
    </button>
  );
}
