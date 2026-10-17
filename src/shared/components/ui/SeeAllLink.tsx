import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Icon } from './Icon';

/**
 * The gold text link with a forward caret (design `.link`): "See all", "How auctions work". The
 * hit area grows past the text so it is finger-sized without changing the layout.
 */
export function SeeAllLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center gap-1 text-sm font-medium text-gold light:text-gold-lo',
        'after:absolute after:-inset-x-2 after:-inset-y-[11px] after:content-[""]',
        className,
      )}
    >
      {children}
      <Icon name="caret-left" size={15} className="ltr:-scale-x-100" />
    </Link>
  );
}
