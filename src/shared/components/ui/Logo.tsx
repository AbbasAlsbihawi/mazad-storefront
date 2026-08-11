import { cn } from '@shared/lib';

/**
 * The Mazad mark — a modular meem built from one circle and one right-angle stroke, 8pt weight
 * on a 64pt grid (design system, `assets/logo-mark.svg`). Drawn in `currentColor` so it inherits
 * the brand blue in both themes; never recolor it beyond blue, white or black.
 */
export function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0 text-primary', className)}
      aria-hidden
      focusable={false}
    >
      <circle cx="42" cy="30" r="12" />
      <path d="M30 42H14" />
    </svg>
  );
}
