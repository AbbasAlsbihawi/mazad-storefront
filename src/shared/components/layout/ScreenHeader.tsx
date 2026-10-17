'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { IconButton } from '@shared/components/ui';
import type { NavBarAction } from '@shared/components/ios';
import { BrandLockup } from '@shared/components/brand';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

export interface ScreenHeaderProps {
  title: string;
  /** Tab roots get the large start-aligned title on phones; pushed screens the centred one. */
  isRoot?: boolean;
  /** Shows the Bidoom lockup beside the phone title (the home screen). */
  hasLogo?: boolean;
  subtitle?: ReactNode;
  backHref?: string;
  /** Phone actions; the first one sits at the end of the bar. */
  actions?: NavBarAction[];
  /** Desktop breadcrumbs above the title; the title itself is the last crumb. */
  crumbs?: Crumb[];
  /** Content at the end of the desktop title row (a primary action). */
  desktopTrailing?: ReactNode;
}

/**
 * The one place a screen declares its header, with a single h1 that changes place by width.
 * Phones: a pushed screen's bar (round back control, centred title, one action) or a tab root's
 * large display title (design `.navbar` / `.ttl`). From 960px: breadcrumbs and a display-face
 * title in the page column (design `.crumbs` + `.t-h1`).
 */
export function ScreenHeader({
  title,
  isRoot = false,
  hasLogo = false,
  subtitle,
  backHref,
  actions = [],
  crumbs,
  desktopTrailing,
}: ScreenHeaderProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const action = actions[0];
  const hasBack = Boolean(backHref) && !isRoot;

  return (
    <header
      className={cn(
        'z-30 mx-auto w-full max-w-page lg:static lg:block lg:px-10 lg:pt-0 lg:pb-6',
        isRoot
          ? 'flex items-end justify-between gap-3 px-5 pt-1 pb-4'
          : 'sticky top-0 grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 bg-[linear-gradient(var(--color-background)_70%,transparent)] px-4 pt-2 pb-3 lg:bg-none',
      )}
    >
      {isRoot ? null : hasBack ? (
        <IconButton
          name="caret-right"
          className="lg:hidden ltr:[&>svg]:-scale-x-100"
          label={t('nav.back')}
          onClick={() => router.push(backHref ?? '/')}
        />
      ) : (
        <span className="lg:hidden" />
      )}

      <div className={cn('grid min-w-0 gap-1', !isRoot && 'lg:gap-1')}>
        <Breadcrumbs items={[...(crumbs ?? []), { label: title }]} className="hidden lg:block" />
        <div className="flex items-end justify-between gap-4 lg:pt-2">
          <div className="grid min-w-0 gap-1">
            <div className="flex items-center gap-2.5">
              {hasLogo ? (
                <span className="lg:hidden">
                  <BrandLockup />
                </span>
              ) : null}
              <h1
                className={cn(
                  'text-foreground lg:font-display lg:text-h1-lg lg:font-normal lg:text-start',
                  hasLogo && 'sr-only lg:not-sr-only',
                  isRoot
                    ? 'font-display text-h1 font-normal'
                    : 'truncate text-center text-[17px] font-medium lg:whitespace-normal',
                )}
              >
                {title}
              </h1>
            </div>
            {subtitle ? (
              <p className={cn('text-[13px] text-foreground-soft', !isRoot && 'hidden lg:block')}>
                {subtitle}
              </p>
            ) : null}
          </div>
          {desktopTrailing ? (
            <div className="hidden shrink-0 lg:flex">{desktopTrailing}</div>
          ) : null}
        </div>
      </div>

      {action ? (
        <IconButton
          name={action.name}
          label={action.label}
          tone={action.tone ?? 'surface'}
          badge={action.badge}
          className="lg:hidden"
          onClick={() => (action.href ? router.push(action.href) : action.onClick?.())}
        />
      ) : isRoot ? null : (
        <span className="lg:hidden" />
      )}
    </header>
  );
}
