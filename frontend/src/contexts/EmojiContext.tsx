import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface EmojiContextValue {
  emojisEnabled: boolean;
  toggleEmojis: () => void;
}

const EmojiContext = createContext<EmojiContextValue | null>(null);

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojisEnabled, setEmojisEnabled] = useState(() => {
    const saved = localStorage.getItem('cifra-emojis');
    return saved !== 'off';
  });

  const toggleEmojis = () => {
    setEmojisEnabled(prev => {
      const next = !prev;
      localStorage.setItem('cifra-emojis', next ? 'on' : 'off');
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-emojis', emojisEnabled ? 'on' : 'off');
  }, [emojisEnabled]);

  return (
    <EmojiContext.Provider value={{ emojisEnabled, toggleEmojis }}>
      {children}
    </EmojiContext.Provider>
  );
}

export function useEmoji() {
  const ctx = useContext(EmojiContext);
  if (!ctx) throw new Error('useEmoji must be used within EmojiProvider');
  return ctx;
}
