import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dictionaries, TranslationKey } from './translations';
import { Language, Localized, pick } from './types';
import { readStorage, writeStorage } from '../lib/storage';

const STORAGE_KEY = 'growthfund_language';

/** Values interpolated into a translation string via {{token}}. */
export type TranslateVars = Record<string, string | number>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate a key, interpolating {{token}} placeholders. */
  t: (key: TranslationKey, vars?: TranslateVars) => string;
  /** Resolve a Localized data value for the active language. */
  tr: (value: Localized | string) => string;
  /** Locale tag suitable for Intl formatters. */
  locale: string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const detectInitialLanguage = (): Language => {
  const saved = readStorage(STORAGE_KEY);
  if (saved === 'fr' || saved === 'en') return saved;

  if (typeof navigator !== 'undefined') {
    // The platform is Franc CFA focused, so a French browser gets French.
    const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const tag of preferred) {
      if (tag?.toLowerCase().startsWith('fr')) return 'fr';
      if (tag?.toLowerCase().startsWith('en')) return 'en';
    }
  }
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    writeStorage(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslateVars): string => {
      // Fall back to English, then to the key itself, so a missing
      // translation degrades to readable text rather than blank UI.
      const raw = dictionaries[language][key] ?? dictionaries.en[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{\{(\w+)\}\}/g, (match, token: string) =>
        token in vars ? String(vars[token]) : match,
      );
    },
    [language],
  );

  const tr = useCallback((value: Localized | string) => pick(value, language), [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      tr,
      locale: language === 'fr' ? 'fr-FR' : 'en-GB',
    }),
    [language, setLanguage, t, tr],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};
