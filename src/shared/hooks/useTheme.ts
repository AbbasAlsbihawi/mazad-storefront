'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@shared/store';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    // Dark is the :root default; only light needs the attribute (see globals.css).
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return { theme, setTheme };
}
