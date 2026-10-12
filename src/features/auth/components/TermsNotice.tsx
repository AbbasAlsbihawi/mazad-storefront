'use client';

import Link from 'next/link';
import { Trans } from 'react-i18next';
import { ROUTES } from '@shared/constants';
import { useAuthTranslation } from '../hooks/useAuthTranslation';

const LINK_CLASS = 'font-medium text-accent hover:underline';

/** "By creating an account you agree to the Terms and Privacy policy", both linked. */
export function TermsNotice() {
  const { t } = useAuthTranslation();
  return (
    <p className="text-footnote text-muted-foreground" data-testid="register-terms">
      <Trans
        t={t}
        i18nKey="register.agree"
        components={{
          terms: <Link href={ROUTES.helpTopic('terms')} className={LINK_CLASS} />,
          privacy: <Link href={ROUTES.helpTopic('privacy')} className={LINK_CLASS} />,
        }}
      />
    </p>
  );
}
