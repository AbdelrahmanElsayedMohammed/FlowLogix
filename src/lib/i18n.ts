/**
 * i18n.ts — react-i18next setup (Arabic + English, RTL/LTR aware)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'ar',
    lng: 'ar',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'flowlogix-i18n-lang',
    },
  });

export default i18n;