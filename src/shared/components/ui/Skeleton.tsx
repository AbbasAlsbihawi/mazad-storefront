import type { HTMLAttributes } from 'react';
import { cn } from '@shared/lib';

const RADIUS_CLASSES = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Match the radius of the element being stood in for, or the swap reads as a jump. */
  radius?: keyof typeof RADIUS_CLASSES;
}

export function Skeleton({ radius = 'md', className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-fill', RADIUS_CLASSES[radius], className)}
      aria-hidden
      {...props}
    />
  );
}

/**
 * The grid's loading unit. Its footprint has to match AuctionCard exactly — same radius, same
 * 1:1 well, same three text rows — so the real cards don't shift in when they arrive.
 */
export function AuctionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-surface shadow-card">
      <Skeleton radius="sm" className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 px-3 pt-2.5 pb-3">
        <Skeleton radius="sm" className="h-3 w-full" />
        <Skeleton radius="sm" className="h-3 w-3/5" />
        <Skeleton radius="sm" className="mt-auto h-4 w-2/3" />
      </div>
    </div>
  );
}
