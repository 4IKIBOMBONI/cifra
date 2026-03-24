import { Moon, Sun, Sparkles } from 'lucide-react';
import { useThemeStore, type Theme } from '@/store/themeStore';
import { useI18n } from '@/store/i18nStore';

const themes: { id: Theme; icon: typeof Sun; }[] = [
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
  { id: 'neon', icon: Sparkles },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useI18n();

  const handleSwitch = () => {
    // Enable smooth transitions
    document.documentElement.classList.add('theme-transitioning');
    const order: Theme[] = ['dark', 'light', 'neon'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350);
  };

  const CurrentIcon = themes.find(t => t.id === theme)!.icon;
  const label = t.theme[theme];

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated/60 hover:bg-bg-elevated border border-border/50 transition-all duration-200 group"
      aria-label={t.a11y.changeTheme}
      title={label}
    >
      <CurrentIcon
        size={15}
        className="text-text-muted group-hover:text-text-primary transition-colors"
      />
      <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors hidden sm:inline">
        {label}
      </span>
    </button>
  );
}
