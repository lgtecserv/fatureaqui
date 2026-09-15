import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import pt from '../locales/pt.json';

// Handle cases where JSON plugin might export differently in production
const getTranslations = (mod: any) => {
  return mod?.translation || mod?.default?.translation || mod;
};

const resources = {
  en: { translation: getTranslations(en) },
  pt: { translation: getTranslations(pt) }
};

const i18nConfig = {
  resources,
  fallbackLng: 'pt',
  supportedLngs: ['pt', 'en'],
  interpolation: {
    escapeValue: false 
  },
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage', 'cookie']
  }
};

// Use explicit pt language on the server to avoid SSR hydration mismatches
if (typeof window !== 'undefined') {
  i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);
} else {
  i18n.use(initReactI18next).init({
    ...i18nConfig,
    lng: 'pt', // Explicitly set for SSR
  });
}

export default i18n;
