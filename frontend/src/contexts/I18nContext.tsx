import { useState, useEffect, type ReactNode } from 'react';
import { I18nContext, translations, type Locale, type TranslationKey } from '@/i18n';

function getInitialLocale(): Locale {
  const saved = localStorage.getItem('cifra-locale') as Locale | null;
  if (saved && ['ru', 'en'].includes(saved)) return saved;
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === 'en' ? 'en' : 'ru';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('cifra-locale', l);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations['ru'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
