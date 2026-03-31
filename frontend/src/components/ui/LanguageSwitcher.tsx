import { useI18n } from '@/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
      className="px-2 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-bg-elevated transition-colors text-text-secondary hover:text-text-primary uppercase tracking-wider"
      aria-label="Switch language"
      title={locale === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      {locale === 'ru' ? 'EN' : 'RU'}
    </button>
  );
}
