import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Emoji } from '@/components/ui/Emoji';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-bg-elevated rounded-lg transition-colors group"
        aria-label="Переключить тему"
        title="Переключить тему"
      >
        <Palette size={18} className="text-text-muted group-hover:text-text-primary transition-colors" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-bg-surface border border-border rounded-xl shadow-card animate-fade-in overflow-hidden z-50">
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  theme === t.id
                    ? 'text-primary bg-primary/10 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <span className="text-base"><Emoji>{t.icon}</Emoji></span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
