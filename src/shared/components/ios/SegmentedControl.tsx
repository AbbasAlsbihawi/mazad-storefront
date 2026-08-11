'use client';

import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

export interface Segment<T extends string> {
  id: T;
  label: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name for the group — "auction detail sections", "bid status". */
  label: string;
  className?: string;
}

/**
 * SegmentedControl — iOS segmented tabs on a sunken track. The 3pt-inset thumb slides on
 * `inset-inline-start`, which is what makes it travel the correct way in RTL for free.
 */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    segments.findIndex((segment) => segment.id === value),
  );

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('relative flex rounded-md bg-fill p-[3px]', className)}
    >
      <span
        aria-hidden
        className="absolute inset-y-[3px] rounded-[11px] bg-surface shadow-card transition-[inset-inline-start] duration-medium ease-ios"
        style={{
          insetInlineStart: `calc(${(activeIndex * 100) / segments.length}% + 3px)`,
          width: `calc(${100 / segments.length}% - 6px)`,
        }}
      />
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
              'relative min-h-[38px] flex-1 text-subhead transition-colors duration-fast ease-ios',
              isActive ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground',
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
