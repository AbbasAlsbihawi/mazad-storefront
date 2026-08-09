'use client';

import { useEffect } from 'react';
import i18n from '@shared/i18n';
import { useLocaleStore, getDirection, type Locale } from '@shared/store';

export function useLocale() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const direction = getDirection(locale);

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  function changeLocale(next: Locale) {
    setLocale(next);
  }

  return { locale, direction, changeLocale };
}
