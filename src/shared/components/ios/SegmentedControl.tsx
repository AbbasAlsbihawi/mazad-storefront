'use client';

import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

export interface Segment<T extends string> {
  id: T;
  label: ReactNode;
  /** A count after the label, already localized. */
  count?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name for the group: "auction detail sections", "bid status". */
  label: string;
  className?: string;
}

/**
 * SegmentedControl (design `.seg`): exclusive choices on a pill track; the chosen one lifts onto
 * the high surface with a hairline (in light, the card surface with a gold hairline).
 */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'flex gap-1 rounded-full border border-border bg-surface-raised p-1',
        className,
      )}
    >
      {segments.map((segment) => {
        const isActive = segment.id === value;
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(segment.id)}
            className={cn(
              'inline-flex h-[38px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-1.5 text-sm font-medium whitespace-nowrap',
              'transition-[background-color,color,box-shadow] duration-fast ease-ios',
              isActive
                ? 'bg-surface-high text-foreground shadow-[inset_0_0_0_1px_var(--color-border-strong)] light:bg-surface light:shadow-[inset_0_0_0_1px_var(--color-gold-line),0_2px_6px_-2px_rgb(60_40_10/25%)]'
                : 'text-foreground-soft hover:text-foreground',
            )}
          >
            {segment.label}
            {segment.count != null ? (
              <span className="font-tabular text-xs text-muted-foreground">{segment.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
