'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'node_modules/react-i18next';
import { ROUTES } from '@shared/constants';
import { useLocale, useTheme } from '@shared/hooks';
import { Button, buttonVariants } from '@shared/components/ui';
import { cn } from '@shared/lib';

export interface HeaderProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export function Header({ isAuthenticated, onSignOut }: HeaderProps) {
  const { t } = useTranslation('common');
  const { locale, changeLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link href={ROUTES.home} className="text-lg font-bold text-accent">
          {t('app.name')}
        </Link>

        <nav aria-label={t('nav.auctions')}>
          <Link
            href={ROUTES.auctions}
            aria-current={pathname === ROUTES.auctions ? 'page' : undefined}
            className="text-sm font-medium text-foreground-soft hover:text-foreground aria-[current=page]:text-foreground"
          >
            {t('nav.auctions')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLocale(locale === 'ar' ? 'en' : 'ar')}
          >
            {locale === 'ar' ? t('locale.en') : t('locale.ar')}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>

          {isAuthenticated ? (
            <>
              <Link
                href={ROUTES.account}
                className="text-sm font-medium text-foreground-soft hover:text-foreground"
              >
                {t('nav.account')}
              </Link>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="text-sm font-medium text-foreground-soft hover:text-foreground"
              >
                {t('nav.signIn')}
              </Link>
              <Link href={ROUTES.register} className={cn(buttonVariants({ size: 'sm' }))}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
    </svg>
  );
}
