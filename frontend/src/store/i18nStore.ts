import { create } from 'zustand';
import { ru } from '@/i18n/ru';
import { en } from '@/i18n/en';

export type Locale = 'ru' | 'en';

export type TranslationKeys = typeof ru;

const translations: Record<Locale, TranslationKeys> = { ru, en };

interface I18nState {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  initLocale: () => void;
}

function applyLocale(locale: Locale) {
  document.documentElement.setAttribute('lang', locale);
}

export const useI18n = create<I18nState>((set) => ({
  locale: 'ru',
  t: ru,

  setLocale: (locale) => {
    localStorage.setItem('cifra-locale', locale);
    applyLocale(locale);
    set({ locale, t: translations[locale] });
  },

  initLocale: () => {
    const saved = localStorage.getItem('cifra-locale') as Locale | null;
    const browserLang = navigator.language.startsWith('en') ? 'en' : 'ru';
    const locale = saved && ['ru', 'en'].includes(saved) ? saved : browserLang;
    applyLocale(locale);
    set({ locale, t: translations[locale] });
  },
}));
