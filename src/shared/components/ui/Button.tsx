import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { Spinner } from './Spinner';

/*
 * Pill buttons (design `.btn`). Gold is for the one primary action per screen; everything else is
 * soft (raised surface), line (gold outline), danger or plain. The older variant names map onto
 * these so every screen picks up the Bidoom look.
 */
const GOLD =
  'gold-sheen bg-grad text-gold-ink shadow-gold hover:brightness-105 disabled:bg-none disabled:bg-gold-soft disabled:text-gold disabled:shadow-none disabled:opacity-60';
const SOFT =
  'border border-border-strong bg-surface-raised text-foreground hover:border-gold-line disabled:text-muted-foreground disabled:opacity-60';
const LINE =
  'border border-gold-line bg-transparent text-gold hover:bg-gold-soft light:text-gold-lo disabled:opacity-45';
const DANGER =
  'bg-destructive-soft text-destructive hover:brightness-110 disabled:border disabled:border-border-strong disabled:bg-surface-raised disabled:text-muted-foreground';
const DANGER_LINE =
  'border border-destructive bg-transparent text-destructive hover:bg-destructive-soft disabled:border-border-strong disabled:text-muted-foreground';
const PLAIN = 'bg-transparent text-gold hover:bg-gold-soft disabled:opacity-45';

const VARIANT_CLASSES = {
  gold: GOLD,
  soft: SOFT,
  line: LINE,
  danger: DANGER,
  dangerLine: DANGER_LINE,
  plain: PLAIN,
  // legacy names
  filled: GOLD,
  tinted: LINE,
  gray: SOFT,
  outline: SOFT,
  destructive: DANGER,
} as const;

const SIZE_CLASSES = {
  sm: 'h-10 px-4 text-[13.5px] gap-2',
  md: 'h-[52px] px-6 text-[15px] gap-2.5',
  lg: 'h-[52px] px-7 text-[15px] gap-2.5',
  icon: 'size-11',
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;

export interface ButtonVariantProps {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE_CLASSES;
  isFullWidth?: boolean;
  /** Kept for older call sites; the gold variant always carries its glow. */
  hasShadow?: boolean;
}

/** Shares Button's visual style with plain `<Link>`s that navigate rather than act. */
export function buttonVariants({
  variant = 'gold',
  size = 'md',
  isFullWidth = false,
}: ButtonVariantProps = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap',
    'transition-[transform,filter,background-color,border-color] duration-fast ease-ios active:scale-98',
    'disabled:pointer-events-none',
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    isFullWidth && 'w-full',
  );
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, ButtonVariantProps {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'gold',
    size = 'md',
    isFullWidth = false,
    hasShadow: _hasShadow,
    isLoading = false,
    disabled,
    type = 'button',
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={isLoading}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, isFullWidth }), className)}
      {...props}
    >
      {isLoading ? <Spinner size={16} /> : null}
      {children}
    </button>
  );
});
