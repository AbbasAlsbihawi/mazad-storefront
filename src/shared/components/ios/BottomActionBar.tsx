import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

/**
 * BottomActionBar (design `.bidbar`): the pinned action on phone detail screens, a glass pill
 * floating over a fade into the page. Desktop keeps the action beside the content instead, so the
 * bar is hidden from 960px.
 */
export function BottomActionBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 mx-auto grid max-w-[600px] gap-2.5 px-[18px] pt-3.5',
        'pb-[calc(env(safe-area-inset-bottom)+18px)]',
        'bg-[linear-gradient(transparent,var(--color-background)_26%)] lg:hidden',
        className,
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-glass-line bg-glass p-2.5 shadow-card backdrop-glass">
        {children}
      </div>
    </div>
  );
}
