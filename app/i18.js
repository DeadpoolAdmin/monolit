import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation files directly
import en from '@/public/locales/en/translation.json';
import fr from '@/public/locales/fr/translation.json';
import hy from '@/public/locales/hy/translation.json';
import pt from '@/public/locales/pt/translation.json';
import es from '@/public/locales/es/translation.json';


// Get language from localStorage or fallback to 'en'
const savedLanguage = localStorage.getItem('lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },

    // No backend → Provide resources manually
    resources: {
      en: { translation: en },
      hy: { translation: hy },
      pt: { translation: pt },
      es: { translation: es },
      fr: { translation: fr },
    },
  });

// Update localStorage when the language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
});

export default i18n;
