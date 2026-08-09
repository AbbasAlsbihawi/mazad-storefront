import type { HTMLAttributes } from 'react';
import { cn } from '@shared/lib';

const TONE_CLASSES = {
  live: 'bg-live/15 text-live',
  upcoming: 'bg-info/15 text-info',
  warning: 'bg-warning/15 text-warning',
  neutral: 'bg-muted-foreground/15 text-muted-foreground',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof TONE_CLASSES;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
