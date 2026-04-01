import { Moon, Sun, Sparkles } from 'lucide-react';
import { useThemeStore, type Theme } from '@/store/themeStore';
import { useI18n } from '@/store/i18nStore';

const themes: { id: Theme; icon: typeof Sun; color: string }[] = [
  { id: 'light', icon: Sun, color: 'text-amber-400' },
  { id: 'dark', icon: Moon, color: 'text-blue-400' },
  { id: 'neon', icon: Sparkles, color: 'text-purple-400' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useI18n();

  const handleSwitch = () => {
    document.documentElement.classList.add('theme-transitioning');
    const order: Theme[] = ['dark', 'light', 'neon'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350);
  };

  const current = themes.find(t => t.id === theme)!;
  const CurrentIcon = current.icon;
  const label = t.theme[theme];

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated/60 hover:bg-bg-elevated border border-border/50 transition-all duration-200 group hover:scale-105"
      aria-label={t.a11y.changeTheme}
      title={label}
    >
      <CurrentIcon
        size={15}
        className={`${current.color} transition-all group-hover:rotate-12`}
      />
      <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors hidden sm:inline">
        {label}
      </span>
    </button>
  );
}
