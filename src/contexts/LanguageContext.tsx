import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { I18nManager } from 'react-native';
import i18n, { type AppLanguage } from '../i18n';
import { applyLanguageWithRTL } from '../lib/rtl';
import { supabase } from '../lib/supabase';

interface LanguageContextType {
  language: AppLanguage;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: AppLanguage, userId?: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: AppLanguage;
}) {
  const [language, setLang] = useState<AppLanguage>(initialLang);
  const direction: 'rtl' | 'ltr' = I18nManager.isRTL ? 'rtl' : 'ltr';

  async function setLanguage(lang: AppLanguage, userId?: string) {
    await i18n.changeLanguage(lang);
    setLang(lang);

    // Persist to Supabase profile if logged in
    if (userId) {
      await supabase.from('profiles').update({ lang }).eq('id', userId);
    }

    // This may trigger app reload if direction changes
    await applyLanguageWithRTL(lang);
  }

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
