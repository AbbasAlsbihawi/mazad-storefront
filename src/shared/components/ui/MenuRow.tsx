import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

export interface MenuRowProps {
  icon: IconName;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing content before the chevron: a count, a value, a toggle. */
  tail?: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Hide the chevron (rows that toggle in place). */
  hasChevron?: boolean;
  /** Delete account, sign out: red tile, red title. */
  isDanger?: boolean;
  className?: string;
}

const ROW =
  'grid min-h-[62px] w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[22px] border border-border bg-surface px-3.5 py-2 text-start transition-[border-color] duration-fast ease-ios hover:border-border-strong';

/** A menu row (design `.mrow`): gold icon tile, title and subtitle, a tail and a chevron. */
export function MenuRow({
  icon,
  title,
  subtitle,
  tail,
  href,
  onClick,
  hasChevron = true,
  isDanger = false,
  className,
}: MenuRowProps) {
  const body = (
    <>
      <span
        aria-hidden
        className={cn(
          'grid size-11 place-items-center rounded-[14px] border',
          isDanger ? 'border-transparent bg-destructive-soft text-destructive' : 'bg-tile',
        )}
      >
        <Icon name={icon} size={24} tone={isDanger ? 'current' : 'gold'} />
      </span>
      <span className="grid min-w-0 leading-[1.35]">
        <span className={cn('text-[15px] font-medium', isDanger && 'text-destructive')}>
          {title}
        </span>
        {subtitle ? <span className="text-[12.5px] text-muted-foreground">{subtitle}</span> : null}
      </span>
      <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
        {tail}
        {hasChevron ? <Icon name="caret-left" size={17} className="ltr:-scale-x-100" /> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(ROW, className)}>
        {body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(ROW, className)}>
        {body}
      </button>
    );
  }
  return <div className={cn(ROW, className)}>{body}</div>;
}
