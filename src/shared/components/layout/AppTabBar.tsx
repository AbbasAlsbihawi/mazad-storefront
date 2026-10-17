'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { cn, resolveActiveTabHref } from '@shared/lib';
import { CountBadge, Icon, type IconName } from '@shared/components/ui';

interface Tab {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
}

/**
 * The phone tab bar (design `.tabbar`): a floating, near-solid glass capsule with five tabs, each
 * an icon from the Bidoom sheet over its label. The active tab gets a gold icon and label on a
 * soft gold pill. Hidden from 960px, where the header carries the navigation.
 */
export function AppTabBar({ outbidCount }: { outbidCount?: number }) {
  const { t } = useTranslation('common');
  const pathname = usePathname();

  const tabs: Tab[] = [
    { href: ROUTES.home, label: t('tabs.home'), icon: 'house' },
    { href: ROUTES.auctions, label: t('tabs.browse'), icon: 'grid' },
    { href: ROUTES.myBids, label: t('tabs.bids'), icon: 'paddle', badge: outbidCount },
    { href: ROUTES.watchlistList, label: t('tabs.watchlist'), icon: 'heart' },
    { href: ROUTES.account, label: t('tabs.account'), icon: 'user' },
  ];
  const activeHref = resolveActiveTabHref(
    tabs.map((tab) => tab.href),
    pathname,
  );

  return (
    <nav
      aria-label={t('nav.main')}
      className={cn(
        'fixed inset-x-3.5 bottom-[calc(env(safe-area-inset-bottom)+22px)] z-40 mx-auto flex h-[74px] max-w-[560px] items-center justify-between rounded-[30px] px-1.5',
        'border border-glass-line bg-tabbar shadow-card backdrop-glass lg:hidden',
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.href === activeHref;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'grid h-16 min-w-0 flex-1 content-center justify-items-center gap-[5px] rounded-[22px] transition-colors duration-medium',
              isActive ? 'text-gold [--knock:var(--color-surface)]' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'relative grid h-8 w-[54px] place-items-center rounded-full transition-[background-color,box-shadow] duration-medium ease-ios',
                isActive && 'bg-gold-soft shadow-[inset_0_0_0_1px_var(--color-gold-line)]',
              )}
            >
              <Icon
                name={tab.icon}
                size={24}
                weight={4.4}
                isFilled={isActive}
                tone={isActive ? 'gold' : 'current'}
              />
              {tab.badge ? (
                <CountBadge
                  value={tab.badge}
                  tone="alert"
                  className="-top-1 end-1 h-[17px] min-w-[17px] border-surface text-[10px]"
                />
              ) : null}
            </span>
            <span className="text-[11px] leading-[1.1] font-medium whitespace-nowrap">
              {tab.label}
            </span>
            {tab.badge ? (
              <span className="sr-only">{t('tabs.outbid', { count: tab.badge })}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
