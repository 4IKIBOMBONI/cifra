import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { useThemeStore } from './store/themeStore';
import { useI18n } from './store/i18nStore';

// Initialize theme and locale before render
useThemeStore.getState().initTheme();
useI18n.getState().initLocale();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — offline features unavailable
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
