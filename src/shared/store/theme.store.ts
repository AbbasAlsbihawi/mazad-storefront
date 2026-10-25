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
      // Dark is Bidoom's default; light is the peer override stamped as `[data-theme='light']`.
      // The per-device choice keeps its storage key, so a stored preference carries over.
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: STORAGE_KEYS.theme },
  ),
);
