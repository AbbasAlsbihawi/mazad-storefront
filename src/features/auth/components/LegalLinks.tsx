'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { useAuthTranslation } from '../hooks/useAuthTranslation';

/**
 * Help, Privacy and Terms for someone not signed in yet: the sign-in and sign-up screens have no
 * tab bar, so this is how they reach the policies before creating an account.
 */
export function LegalLinks() {
  const { t } = useAuthTranslation();
  const links = [
    { href: ROUTES.help, label: t('legal.help') },
    { href: ROUTES.helpTopic('privacy'), label: t('legal.privacy') },
    { href: ROUTES.helpTopic('terms'), label: t('legal.terms') },
  ];

  return (
    <nav aria-label={t('legal.label')} data-testid="legal-links">
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-footnote">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-muted-foreground hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
