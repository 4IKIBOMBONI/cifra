import { create } from 'zustand';

export type Theme = 'dark' | 'light' | 'neon';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const themeColors: Record<Theme, string> = {
    dark: '#0B1120',
    light: '#F9FAFB',
    neon: '#0A0A14',
  };
  if (metaTheme) metaTheme.setAttribute('content', themeColors[theme]);
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  setTheme: (theme) => {
    localStorage.setItem('cifra-theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  initTheme: () => {
    const saved = localStorage.getItem('cifra-theme') as Theme | null;
    const theme = saved && ['dark', 'light', 'neon'].includes(saved) ? saved : getSystemTheme();
    applyTheme(theme);
    set({ theme });
  },
}));
