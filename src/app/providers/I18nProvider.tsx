'use client';

import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@shared/i18n';
import { useLocale } from '@shared/hooks';

export function I18nProvider({ children }: { children: ReactNode }) {
  useLocale(); // keeps <html lang/dir> and i18next in sync with the locale store
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
