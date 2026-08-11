import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@shared/constants';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Light is the design system's default and dark is the peer override, so the stored
      // default and the `[data-theme='dark']` selector agree with each other.
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: STORAGE_KEYS.theme },
  ),
);
