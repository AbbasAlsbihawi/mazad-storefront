'use client';

import { useTranslation } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { TabBar, FloatingTabBar, type TabBarItem } from '@shared/components/ios';

/** `docked` is the flat bar with captions; `floating` is the icon-only capsule over the content. */
export type AppTabBarVariant = 'docked' | 'floating';

/**
 * The app's five roots, in HIG order. Five is the ceiling — anything else reachable from the
 * account screen rather than a sixth tab. The two bar variants read the same item list, so
 * switching between them is a shell decision and never a per-screen one.
 */
export function AppTabBar({ variant = 'docked' }: { variant?: AppTabBarVariant }) {
  const { t } = useTranslation('common');

  const items: TabBarItem[] = [
    { href: ROUTES.home, label: t('tabs.home'), icon: 'house' },
    { href: ROUTES.auctions, label: t('tabs.browse'), icon: 'layout-grid' },
    { href: ROUTES.myBids, label: t('tabs.bids'), icon: 'gavel' },
    { href: ROUTES.watchlistList, label: t('tabs.watchlist'), icon: 'heart' },
    { href: ROUTES.account, label: t('tabs.account'), icon: 'user-round' },
  ];

  const Bar = variant === 'floating' ? FloatingTabBar : TabBar;

  return <Bar items={items} label={t('nav.main')} />;
}
