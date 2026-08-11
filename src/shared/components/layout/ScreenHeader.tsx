'use client';

import { useTranslation } from 'react-i18next';
import { NavBar, type NavBarAction } from '@shared/components/ios';
import { Logo } from '@shared/components/ui';

export interface ScreenHeaderProps {
  title: string;
  /** Tab roots get the 34pt start-aligned title; pushed screens get the centered 17pt one. */
  isRoot?: boolean;
  /** Renders the Mazad mark before the title — the home screen's lockup. */
  hasLogo?: boolean;
  backHref?: string;
  actions?: NavBarAction[];
}

/**
 * The one place a screen declares its nav bar. Wraps NavBar so back labels and the logo lockup
 * are consistent across every route instead of being re-specified per page.
 */
export function ScreenHeader({
  title,
  isRoot = false,
  hasLogo = false,
  backHref,
  actions,
}: ScreenHeaderProps) {
  const { t } = useTranslation('common');

  return (
    <NavBar
      title={title}
      isLargeTitle={isRoot}
      backHref={backHref}
      backLabel={backHref ? t('nav.back') : undefined}
      leading={hasLogo ? <Logo size={30} /> : undefined}
      actions={actions}
    />
  );
}
