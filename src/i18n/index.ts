/**
 * @file index.ts
 * @description Internationalization (i18n) setup and configuration using `i18next`.
 * Manages language switching, retrieves saved language preferences from `localStorage`,
 * and dynamically adjusts `document.documentElement.dir` (`ltr` or `rtl`) to ensure
 * proper layout directionality.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

// Retrieve user's saved language or fall back to English ('en')
const savedLang = localStorage.getItem('taskflow-lang') || 'en';

// Set document direction and language attribute based on selected language
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLang;

// Initialize i18next with React bindings
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ar,
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
