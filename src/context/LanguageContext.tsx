'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '@/types';
import { translations } from '@/data/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  tObj: <T>(enVal: T, kmVal?: T) => T;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'printcraft_language_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (stored === 'en' || stored === 'km') {
        setLangState(stored);
      } else {
        // Default to Khmer if system language starts with km
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('km')) {
          setLangState('km');
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'km' : 'en');
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[lang];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if key missing in current language
        let fallback: any = translations.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return path;

    if (params) {
      let result = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
      return result;
    }

    return current;
  };

  const tObj = <T,>(enVal: T, kmVal?: T): T => {
    if (lang === 'km' && kmVal !== undefined && kmVal !== null && kmVal !== '') {
      return kmVal;
    }
    return enVal;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        tObj,
        isHydrated,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
