/**
 * @file themeStore.ts
 * @description Global Zustand state management store for Application Theme (`light` / `dark`).
 * Persists selected theme preference in `localStorage` under `taskflow-theme` and toggles
 * the `dark` CSS class on the root HTML `documentElement`.
 */

import { create } from 'zustand';

/**
 * ThemeState Interface
 * Defines current active theme state and mutation actions.
 */
interface ThemeState {
  /** Active visual theme mode (`light` or `dark`) */
  theme: 'light' | 'dark';
  /** Toggles the application between light and dark modes */
  toggleTheme: () => void;
  /** Explicitly sets the application theme to a specific mode */
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Zustand Hook: `useThemeStore`
 * Initializes from saved `localStorage` preference and synchronizes DOM classlists.
 */
export const useThemeStore = create<ThemeState>((set) => {
  const savedTheme = (localStorage.getItem('taskflow-theme') as 'light' | 'dark') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    theme: savedTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('taskflow-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
    setTheme: (theme) => set(() => {
      localStorage.setItem('taskflow-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme };
    }),
  };
});
