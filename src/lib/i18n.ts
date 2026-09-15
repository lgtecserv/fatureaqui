import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import pt from '../locales/pt.json';

const extractTranslations = (localeFile: any) => {
  if (localeFile?.translation) return localeFile.translation;
  if (localeFile?.default?.translation) return localeFile.default.translation;
  if (localeFile?.default) return localeFile.default;
  return localeFile;
};

const resources = {
  en: { translation: extractTranslations(en) },
  pt: { translation: extractTranslations(pt) }
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

// Only use LanguageDetector on the client side (browser) to prevent SSR crashes
if (typeof window !== 'undefined') {
  i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);
} else {
  i18n.use(initReactI18next).init(i18nConfig);
}

export default i18n;
