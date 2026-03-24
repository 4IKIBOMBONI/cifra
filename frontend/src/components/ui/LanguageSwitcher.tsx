import { Globe } from 'lucide-react';
import { useI18n, type Locale } from '@/store/i18nStore';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const toggle = () => {
    const next: Locale = locale === 'ru' ? 'en' : 'ru';
    setLocale(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated/60 hover:bg-bg-elevated border border-border/50 transition-all duration-200 group"
      aria-label={t.a11y.changeLanguage}
      title={locale === 'ru' ? 'English' : 'Русский'}
    >
      <Globe
        size={15}
        className="text-text-muted group-hover:text-text-primary transition-colors"
      />
      <span className="text-xs font-bold text-text-muted group-hover:text-text-primary transition-colors uppercase">
        {locale === 'ru' ? 'EN' : 'RU'}
      </span>
    </button>
  );
}
