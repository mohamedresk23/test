import { create } from 'zustand';
import i18n from '@/i18n';

interface LangState {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: (localStorage.getItem('taskflow-lang') as 'ar' | 'en') || 'ar',
  setLang: (lang) => {
    localStorage.setItem('taskflow-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
    set({ lang });
  },
}));
