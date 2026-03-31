import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'neon';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; label: string; icon: string }[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEMES: ThemeContextValue['themes'] = [
  { id: 'dark', label: 'Тёмная', icon: '🌙' },
  { id: 'light', label: 'Светлая', icon: '☀️' },
  { id: 'neon', label: 'Неон', icon: '⚡' },
];

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('cifra-theme') as Theme | null;
  if (saved && ['dark', 'light', 'neon'].includes(saved)) return saved;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('cifra-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
