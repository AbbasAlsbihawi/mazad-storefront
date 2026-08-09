'use client';

import { useTranslation } from 'node_modules/react-i18next';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {t('app.name')}
    </footer>
  );
}
