import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { EmojiProvider } from './contexts/EmojiContext';
import { I18nProvider } from './contexts/I18nContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <EmojiProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </EmojiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
