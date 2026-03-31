import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ru } from './ru';
import { en } from './en';

export type Locale = 'ru' | 'en';
type TranslationKey = keyof typeof ru;
type Translations = Record<TranslationKey, string>;

const translations: Record<Locale, Translations> = { ru, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export { translations };
export type { TranslationKey };
