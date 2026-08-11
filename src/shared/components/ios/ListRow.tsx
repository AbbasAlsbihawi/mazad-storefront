'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Icon, type IconName } from '@shared/components/ui';

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: IconName;
  iconTone?: 'tint' | 'fill';
  thumbnail?: ReactNode;
  /** Trailing value — a count, a setting's current state. */
  value?: ReactNode;
  hasChevron?: boolean;
  /** Suppresses the hairline; set on the last row of a group. */
  isLast?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * ListRow — iOS inset list row. Group several inside a `Card` for a settings/account list. The
 * disclosure chevron mirrors in RTL through CSS rather than a glyph swap, so it's right on the
 * server render too.
 */
export function ListRow({
  title,
  subtitle,
  icon,
  iconTone = 'tint',
  thumbnail,
  value,
  hasChevron = true,
  isLast = false,
  href,
  onClick,
  className,
}: ListRowProps) {
  const isInteractive = Boolean(href || onClick);

  const content = (
    <>
      {thumbnail ? (
        <span className="size-12 shrink-0 overflow-hidden rounded-sm bg-surface-raised">
          {thumbnail}
        </span>
      ) : icon ? (
        <span
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-sm',
            iconTone === 'tint' ? 'bg-primary-tint text-primary' : 'bg-fill text-foreground-soft',
          )}
        >
          <Icon name={icon} size={18} />
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-callout font-medium text-foreground">{title}</span>
        {subtitle ? (
          <span className="truncate text-footnote text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>

      {value ? (
        <span className="shrink-0 text-subhead font-semibold whitespace-nowrap text-foreground-soft">
          {value}
        </span>
      ) : null}

      {hasChevron && isInteractive ? (
        <Icon
          name="chevron-right"
          size={18}
          className="text-foreground-disabled rtl:-scale-x-100"
        />
      ) : null}
    </>
  );

  const classes = cn(
    'flex w-full items-center gap-3 px-4 py-3 text-start min-h-touch',
    'transition-colors duration-fast ease-ios',
    isInteractive && 'active:bg-fill',
    !isLast && 'border-b border-separator',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}

export interface CategoryTileProps {
  label: ReactNode;
  icon: IconName;
  count?: ReactNode;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

/** CategoryTile — the 60pt rounded-square shortcut used in the home-screen category rail. */
export function CategoryTile({
  label,
  icon,
  count,
  isActive = false,
  href,
  onClick,
}: CategoryTileProps) {
  const content = (
    <>
      <span
        className={cn(
          'inline-flex size-15 items-center justify-center rounded-lg',
          'transition-[transform,background-color] duration-fast ease-ios active:scale-96',
          isActive
            ? 'bg-primary text-primary-foreground shadow-button'
            : 'bg-surface text-primary shadow-card',
        )}
      >
        <Icon name={icon} size={26} />
      </span>
      <span className="text-center text-caption leading-tight font-medium text-foreground-soft">
        {label}
        {count != null ? (
          <span className="block text-caption-2 text-muted-foreground">{count}</span>
        ) : null}
      </span>
    </>
  );

  const classes = 'flex w-19 shrink-0 flex-col items-center gap-2';

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
