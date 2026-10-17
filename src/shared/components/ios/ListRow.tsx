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
            'inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] border',
            iconTone === 'tint'
              ? 'bg-tile'
              : 'border-border bg-surface-raised text-foreground-soft',
          )}
        >
          <Icon name={icon} size={24} tone={iconTone === 'tint' ? 'gold' : 'current'} />
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
        <Icon name="caret-left" size={17} className="text-muted-foreground ltr:-scale-x-100" />
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

/**
 * CategoryTile (design .cat): on phones a 64px gold-glyph tile over its label; from 960px a pill
 * with a small tile and the label beside it. The selected one is ringed in gold.
 */
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
          'grid size-16 place-items-center rounded-[20px] border bg-tile',
          'transition-[box-shadow,border-color] duration-medium ease-ios lg:size-[42px] lg:rounded-[13px]',
          isActive &&
            'border-[1.5px] border-gold shadow-[0_0_0_4px_var(--color-gold-soft),0_12px_26px_-14px_rgb(212_166_70/70%)] lg:border-gold-line lg:shadow-none',
        )}
      >
        <Icon name={icon} tone="gold" size={34} className="lg:size-[25px]" />
      </span>
      <span className="text-center text-[12.5px] leading-tight lg:text-sm">
        {label}
        {count != null ? (
          <span className="block text-caption-2 text-muted-foreground">{count}</span>
        ) : null}
      </span>
    </>
  );

  const classes = cn(
    'grid w-[72px] shrink-0 content-start justify-items-center gap-[7px]',
    'lg:w-auto lg:grid-flow-col lg:items-center lg:gap-2.5 lg:rounded-full lg:border lg:py-1.5 lg:ps-1.5 lg:pe-[18px]',
    isActive
      ? 'text-gold lg:border-gold-line lg:bg-gold-soft light:text-gold-lo'
      : 'text-foreground-soft lg:border-border lg:bg-surface',
  );

  if (href) {
    return (
      <Link href={href} aria-current={isActive ? 'page' : undefined} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-pressed={isActive} className={classes}>
      {content}
    </button>
  );
}
