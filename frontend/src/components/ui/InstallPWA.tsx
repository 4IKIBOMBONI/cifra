import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useI18n } from '@/store/i18nStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { locale } = useI18n();

  useEffect(() => {
    if (localStorage.getItem('cifra-pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000); // Show after 3 seconds
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('cifra-pwa-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-slide-up">
      <div className="bg-bg-surface border border-border rounded-xl p-4 shadow-card backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow-sm">
            <Download size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-0.5">
              {locale === 'ru' ? 'Установить CIFRA' : 'Install CIFRA'}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {locale === 'ru'
                ? 'Добавьте приложение на рабочий стол для быстрого доступа'
                : 'Add the app to your home screen for quick access'}
            </p>
            <div className="flex gap-2 mt-2.5">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                {locale === 'ru' ? 'Установить' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                {locale === 'ru' ? 'Позже' : 'Later'}
              </button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-text-muted hover:text-text-primary shrink-0">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
