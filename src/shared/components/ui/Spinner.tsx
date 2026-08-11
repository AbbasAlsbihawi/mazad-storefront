import { cn } from '@shared/lib';

/**
 * Spinner — a ring in `currentColor`, sized in points. It goes inside the control that triggered
 * the work; the only full-screen spinner in the system is PageLoader on a cold route.
 */
export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('shrink-0 animate-spin', className)}
      aria-hidden="true"
      focusable={false}
    >
      <circle opacity="0.3" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path opacity="0.9" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}
