'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { Icon } from '@shared/components/ui';

export interface Crumb {
  label: string;
  href?: string;
}

/** Desktop breadcrumbs (design `.crumbs`); the last crumb is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useTranslation('common');
  if (items.length === 0) return null;
  return (
    <nav aria-label={t('nav.breadcrumbs')} className={cn('pt-[22px] pb-1.5', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className="flex">
                  <Icon name="caret-left" size={13} className="ltr:-scale-x-100" />
                </li>
              ) : null}
              <li>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={isLast ? 'text-foreground-soft' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
