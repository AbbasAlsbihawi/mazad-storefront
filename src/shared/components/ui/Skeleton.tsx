import type { HTMLAttributes } from 'react';
import { cn } from '@shared/lib';

const RADIUS_CLASSES = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Match the radius of the element being stood in for, or the swap reads as a jump. */
  radius?: keyof typeof RADIUS_CLASSES;
}

/** A shimmering block (design `.skel`). */
export function Skeleton({ radius = 'md', className, ...props }: SkeletonProps) {
  return (
    <div className={cn('skeleton', RADIUS_CLASSES[radius], className)} aria-hidden {...props} />
  );
}

/** A quiet bar inside a skeleton card: the name and price lines placed where the real ones sit. */
function Bar({ className }: { className: string }) {
  return <i className={cn('block rounded-full bg-surface-high opacity-75', className)} />;
}

/**
 * The full-photo lot card's skeleton (design `.sk-lot`): the badge, timer, heart, name and price
 * are drawn inside the picture where the real ones land, so nothing moves when data arrives.
 */
export function AuctionCardSkeleton() {
  return (
    <div aria-hidden className="relative block">
      <div className="skeleton relative aspect-[3/4] overflow-hidden rounded-[22px] border border-border">
        <div className="absolute start-2.5 top-2.5 flex gap-1.5">
          <Bar className="h-6 w-11" />
          <Bar className="h-6 w-[50px]" />
        </div>
        <span className="absolute end-2.5 top-2.5 size-[34px] rounded-full bg-surface-high opacity-75" />
        <div className="absolute inset-x-3 bottom-3.5 grid gap-2">
          <Bar className="h-[11px] w-11/12" />
          <Bar className="h-[11px] w-3/5" />
          <div className="mt-1 flex items-center justify-between">
            <Bar className="h-[17px] w-[48%]" />
            <Bar className="h-2.5 w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
