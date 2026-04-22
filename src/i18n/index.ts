import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import he from './locales/he.json';
import ar from './locales/ar.json';
import en from './locales/en.json';

export type AppLanguage = 'he' | 'ar' | 'en';
export const LANGUAGE_KEY = 'amal_language';
export const RTL_LANGUAGES: AppLanguage[] = ['he', 'ar'];

export async function initI18n(): Promise<AppLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
  const deviceLang = getLocales()[0]?.languageCode ?? 'en';

  let lang: AppLanguage;
  if (stored === 'he' || stored === 'ar' || stored === 'en') {
    lang = stored;
  } else if (deviceLang === 'he' || deviceLang === 'ar') {
    lang = deviceLang;
  } else {
    lang = 'en';
  }

  await i18n.use(initReactI18next).init({
    resources: {
      he: { translation: he },
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: lang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });

  return lang;
}

export default i18n;
