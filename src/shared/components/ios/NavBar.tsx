'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { IconButton, type IconName } from '@shared/components/ui';

export interface NavBarAction {
  name: IconName;
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: 'surface' | 'fill' | 'glass' | 'primary';
  /** Small count rendered over the icon — unread notifications, cart items. */
  badge?: ReactNode;
}

export interface NavBarProps {
  title: ReactNode;
  /** 34pt start-aligned title for tab roots; centered 17pt for pushed screens. */
  isLargeTitle?: boolean;
  /** Shows the mirrored back chevron. `true` pops the router; a string navigates to that route. */
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  leading?: ReactNode;
  actions?: NavBarAction[];
  isTransparent?: boolean;
  className?: string;
}

/**
 * NavBar — the translucent top chrome. Sticky rather than fixed so the document keeps its own
 * scroll height and no page has to reserve a matching top inset by hand.
 */
export function NavBar({
  title,
  isLargeTitle = false,
  backHref,
  backLabel,
  onBack,
  leading,
  actions = [],
  isTransparent = false,
  className,
}: NavBarProps) {
  const router = useRouter();
  const hasBack = Boolean(onBack || backHref || backLabel);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex min-h-nav-bar items-center gap-2',
        isLargeTitle ? 'px-gutter pt-1 pb-2' : 'px-3 py-1.5',
        !isTransparent && 'bg-background/82 backdrop-blur-chrome',
        className,
      )}
    >
      {hasBack ? (
        <IconButton
          // Mirrors via CSS rather than swapping the glyph, so it's correct during SSR too.
          name="chevron-left"
          className="rtl:[&>svg]:-scale-x-100"
          label={backLabel ?? 'Back'}
          onClick={() => (onBack ? onBack() : backHref ? router.push(backHref) : router.back())}
        />
      ) : null}

      <div
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2',
          isLargeTitle ? 'justify-start px-1' : 'justify-center',
        )}
      >
        {leading}
        <h1
          className={cn(
            'truncate text-foreground',
            isLargeTitle ? 'text-large-title font-extrabold' : 'text-headline font-semibold',
          )}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <NavBarActionButton key={action.name} action={action} />
        ))}
      </div>
    </header>
  );
}

function NavBarActionButton({ action }: { action: NavBarAction }) {
  const router = useRouter();

  return (
    <span className="relative inline-flex">
      <IconButton
        name={action.name}
        label={action.label}
        tone={action.tone ?? 'surface'}
        onClick={() => (action.href ? router.push(action.href) : action.onClick?.())}
      />
      {action.badge ? (
        <span
          className={cn(
            'pointer-events-none absolute end-1 top-1 inline-flex h-4 min-w-4 items-center justify-center',
            'rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground',
          )}
        >
          {action.badge}
        </span>
      ) : null}
    </span>
  );
}
