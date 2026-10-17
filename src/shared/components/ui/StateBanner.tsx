import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

const TONE = {
  ok: 'bg-live-soft text-live',
  bad: 'bg-destructive-soft text-destructive',
  warn: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  gold: 'bg-gold-soft text-gold light:text-gold-lo',
} as const;

export type StateTone = keyof typeof TONE;

/**
 * A state line (design `.state`): "You are leading", "You were outbid by…", "The auction was
 * extended". One icon, one sentence, an optional action at the end.
 */
export function StateBanner({
  tone,
  icon,
  isIconFilled = false,
  children,
  action,
  role,
  className,
}: {
  tone: StateTone;
  icon: IconName;
  isIconFilled?: boolean;
  children: ReactNode;
  action?: ReactNode;
  role?: 'status' | 'alert';
  className?: string;
}) {
  return (
    <div
      role={role}
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3.5 text-[14.5px] font-medium',
        TONE[tone],
        className,
      )}
    >
      <Icon name={icon} size={22} isFilled={isIconFilled} />
      <span className="min-w-0 flex-1 text-pretty">{children}</span>
      {action}
    </div>
  );
}

/** A quiet warning note (design `.notice`): drafts, rules that bind, things to know first. */
export function Notice({
  icon = 'info',
  children,
  className,
}: {
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-2.5 rounded-[18px] bg-warning-soft px-3.5 py-3 text-[13.5px] text-warning',
        className,
      )}
    >
      <Icon name={icon} size={18} className="mt-0.5" />
      <span className="min-w-0 flex-1 text-pretty">{children}</span>
    </div>
  );
}
