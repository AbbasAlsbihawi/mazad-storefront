import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the standard 18px inset so simple cards don't need a CardContent wrapper. */
  isInset?: boolean;
  /** Kept for older call sites: Bidoom cards draw a hairline, not a shadow. */
  hasShadow?: boolean;
  /** `framed`: the stronger line and faint gold wash of the important card on a page. */
  tone?: 'plain' | 'framed' | 'gold';
}

const TONE = {
  plain: 'border-border bg-surface',
  framed:
    'border-border-strong bg-surface bg-[linear-gradient(180deg,rgb(226_180_103/5%),transparent_40%)]',
  gold: 'border-gold-line bg-surface bg-[linear-gradient(180deg,var(--color-gold-soft),transparent_75%)]',
} as const;

/** Card (design `.card`): the surface, a hairline and a 24px radius. */
export function Card({
  isInset = false,
  hasShadow: _hasShadow,
  tone = 'plain',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn('rounded-xl border', TONE[tone], isInset && 'p-[18px]', className)}
      {...props}
    />
  );
}

/** The small gold label that heads a panel ("Delivery and payment"), caps in English. */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'px-[18px] pt-[18px] text-[13.5px] leading-[1.3] font-semibold tracking-[0.02em] text-gold',
        'en:text-xs en:tracking-[0.12em] en:uppercase light:text-gold-lo',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-[18px]', className)} {...props} />;
}

export interface SectionHeaderProps {
  title: ReactNode;
  /** A gold icon before the title (the home rails). */
  icon?: IconName;
  actionLabel?: ReactNode;
  /** The trailing control: usually a "See all" link (see SeeAllLink) and/or rail arrows. */
  action?: ReactNode;
  /** h2 by default; a page's own sections under its h1. */
  as?: 'h2' | 'h3';
  className?: string;
}

/** SectionHeader (design `.sec-h`): display-font title with an optional icon and a trailing link. */
export function SectionHeader({
  title,
  icon,
  actionLabel,
  action,
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <Heading className="flex items-center gap-2.5 font-display text-section font-normal text-foreground lg:text-section-lg">
        {icon ? <Icon name={icon} tone="gold" size={24} weight={4.2} /> : null}
        {title}
      </Heading>
      {action ??
        (actionLabel ? (
          <span className="text-sm font-medium text-gold light:text-gold-lo">{actionLabel}</span>
        ) : null)}
    </div>
  );
}
