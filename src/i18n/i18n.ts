import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations (You can import JSON files)
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      language: 'Language',
    },
  },
  bn: {
    translation: {
      welcome: 'স্বাগতম',
      language: 'ভাষা',
    },
  },
};

i18n
  .use(LanguageDetector) // Detects browser/user language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
