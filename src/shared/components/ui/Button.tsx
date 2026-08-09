import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { Spinner } from './Spinner';

const VARIANT_CLASSES = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
  outline: 'border border-border bg-transparent text-foreground hover:bg-surface-raised',
  secondary: 'bg-surface-raised text-foreground hover:opacity-90',
  ghost: 'bg-transparent text-foreground hover:bg-surface-raised',
  link: 'h-auto bg-transparent p-0 text-accent underline-offset-4 hover:underline',
} as const;

const SIZE_CLASSES = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
} as const;

export interface ButtonVariantProps {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
}

/** Shares Button's visual style with plain `<Link>`s that navigate rather than act (see Header). */
export function buttonVariants({ variant = 'default', size = 'default' }: ButtonVariantProps = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
});
