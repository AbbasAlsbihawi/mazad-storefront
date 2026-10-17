'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { IconButton, type IconButtonTone, type IconName } from '@shared/components/ui';

export interface NavBarAction {
  name: IconName;
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: IconButtonTone;
  /** Small count rendered over the icon: unread notifications. */
  badge?: ReactNode;
}

export interface NavBarProps {
  title: ReactNode;
  /** The large start-aligned title of a tab root; pushed screens get the centred one. */
  isLargeTitle?: boolean;
  /** A line under the large title ("124 live and upcoming auctions"). */
  subtitle?: ReactNode;
  /** Shows the back control. A string navigates to that route; otherwise it pops the router. */
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  leading?: ReactNode;
  actions?: NavBarAction[];
  isTransparent?: boolean;
  className?: string;
}

/**
 * NavBar (design `.navbar` / `.ttl`), phones only: from 960px the desktop header and the page's
 * own breadcrumbs and title take over. Pushed screens: a round back control, the title centred,
 * an optional action. Tab roots: a large display-face title at the start.
 */
export function NavBar({
  title,
  isLargeTitle = false,
  subtitle,
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

  if (isLargeTitle) {
    return (
      <header
        className={cn('flex items-end justify-between gap-3 px-5 pt-1 pb-4 lg:hidden', className)}
      >
        <div className="grid min-w-0 gap-1">
          <div className="flex items-center gap-2.5">
            {leading}
            <h1 className="font-display text-h1 font-normal text-foreground">{title}</h1>
          </div>
          {subtitle ? <p className="text-[13px] text-foreground-soft">{subtitle}</p> : null}
        </div>
        {actions.length ? (
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <NavBarActionButton key={action.name} action={action} />
            ))}
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 px-4 pt-2 pb-3 lg:hidden',
        !isTransparent && 'bg-[linear-gradient(var(--color-background)_70%,transparent)]',
        className,
      )}
    >
      {hasBack ? (
        <IconButton
          name="caret-right"
          className="ltr:[&>svg]:-scale-x-100"
          label={backLabel ?? 'Back'}
          onClick={() => (onBack ? onBack() : backHref ? router.push(backHref) : router.back())}
        />
      ) : (
        <span>{leading}</span>
      )}
      <h1 className="truncate text-center text-[17px] font-medium text-foreground">{title}</h1>
      <div className="flex items-center justify-end gap-2">
        {actions.slice(0, 1).map((action) => (
          <NavBarActionButton key={action.name} action={action} />
        ))}
      </div>
    </header>
  );
}

function NavBarActionButton({ action }: { action: NavBarAction }) {
  const router = useRouter();
  return (
    <IconButton
      name={action.name}
      label={action.label}
      tone={action.tone ?? 'surface'}
      badge={action.badge}
      onClick={() => (action.href ? router.push(action.href) : action.onClick?.())}
    />
  );
}
