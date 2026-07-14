/**
 * @file langStore.ts
 * @description Global Zustand state management store for Application Language (`en` / `ar`).
 * Synchronizes the selected language with `localStorage`, updates the `i18next` engine,
 * and sets `document.documentElement.dir` to maintain accurate `ltr` / `rtl` layout.
 */

import { create } from 'zustand';
import i18n from '@/i18n';

/**
 * LangState Interface
 * Defines active language selection state and setter action.
 */
interface LangState {
  /** Selected application language (`en` or `ar`) */
  lang: 'ar' | 'en';
  /** Updates global language across storage, document direction, and i18n */
  setLang: (lang: 'ar' | 'en') => void;
}

/**
 * Zustand Hook: `useLangStore`
 * Controls multi-language switching across the application.
 */
export const useLangStore = create<LangState>((set) => ({
  lang: (localStorage.getItem('taskflow-lang') as 'ar' | 'en') || 'en',
  setLang: (lang) => {
    localStorage.setItem('taskflow-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
    set({ lang });
  },
}));
