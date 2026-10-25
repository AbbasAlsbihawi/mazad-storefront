import type { HTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

/*
 * Status pills (design `.badge`): a soft wash of the state colour with the state colour as text.
 * Gold only for wins, sales and your own lead. `photo` is the dark glass pill over a lot photo.
 */
const TONE_CLASSES = {
  live: 'bg-live-soft text-live',
  ending: 'bg-warning-soft text-warning',
  upcoming: 'bg-info-soft text-info',
  done: 'bg-surface-high text-foreground-soft',
  bad: 'bg-destructive-soft text-destructive',
  gold: 'bg-gold-soft text-gold light:text-gold-lo',
  photo: 'bg-[rgb(12_11_10/55%)] text-on-photo backdrop-blur-[8px]',
  // legacy names
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-surface-high text-foreground-soft',
  primary: 'bg-gold-soft text-gold light:text-gold-lo',
  discount: 'bg-gold-soft text-gold light:text-gold-lo',
} as const;

export type BadgeTone = keyof typeof TONE_CLASSES;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** The pulsing green dot that marks a genuinely live auction. */
  hasDot?: boolean;
  icon?: IconName;
  isIconFilled?: boolean;
}

export function Badge({
  tone = 'done',
  hasDot = false,
  icon,
  isIconFilled = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap',
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    >
      {hasDot ? (
        <span
          className={cn(
            'size-[7px] shrink-0 animate-pulse-dot rounded-full',
            tone === 'photo' ? 'bg-[#7bd39a]' : 'bg-live',
          )}
          aria-hidden
        />
      ) : null}
      {icon ? <Icon name={icon} size={13} isFilled={isIconFilled} /> : null}
      {children}
    </span>
  );
}
