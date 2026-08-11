'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn, resolveActiveTabHref } from '@shared/lib';
import { Icon, type IconName } from '@shared/components/ui';

export interface TabBarItem {
  href: string;
  label: string;
  icon: IconName;
  /** Rendered as a count here; `FloatingTabBar` has no room for numerals and shows a bare dot. */
  badge?: ReactNode;
}

/**
 * TabBar — the fixed bottom chrome, 5 items max per HIG. Fixed rather than sticky because it has
 * to stay put while a long feed scrolls; AppShell pads the scroll area by its height plus the
 * bottom safe area so nothing ends up underneath it.
 */
export function TabBar({ items, label }: { items: TabBarItem[]; label: string }) {
  const pathname = usePathname();
  // Resolved across the whole set, not per item: exactly one tab may be lit at a time.
  const activeHref = resolveActiveTabHref(
    items.map((item) => item.href),
    pathname,
  );

  return (
    <nav
      aria-label={label}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg items-stretch justify-around',
        'bg-surface/88 pt-1.5 pb-[calc(var(--spacing-safe-bottom)-8px)] shadow-bar backdrop-blur-chrome',
      )}
    >
      {items.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-touch min-w-0 flex-1 flex-col items-center justify-center gap-[3px] px-0.5 py-1',
              'transition-colors duration-fast ease-ios',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <span className="relative inline-flex">
              <Icon name={item.icon} size={24} isFilled={isActive && item.icon === 'heart'} />
              {item.badge ? (
                <span
                  className={cn(
                    'absolute -top-1 -end-1.5 inline-flex h-4 min-w-4 items-center justify-center',
                    'rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground',
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                'max-w-full truncate text-caption-2',
                isActive ? 'font-semibold' : 'font-medium',
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * BottomActionBar — the pinned CTA bar on detail screens. The primary action of a screen always
 * lives here rather than inline at the end of a long scroll.
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
        'fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg items-center gap-3',
        'bg-surface/92 px-gutter pt-3 pb-[calc(var(--spacing-safe-bottom)*0.5+12px)]',
        'shadow-bar backdrop-blur-chrome',
        className,
      )}
    >
      {children}
    </div>
  );
}
