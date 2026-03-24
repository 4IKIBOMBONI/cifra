import { Header } from './Header';
import { useI18n } from '@/store/i18nStore';

interface PageLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
  noPadding?: boolean;
}

export function PageLayout({ children, wide = false, noPadding = false }: PageLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bg">
      <a href="#main-content" className="skip-to-content">
        {t.nav.skipToContent}
      </a>
      <Header />
      <main
        id="main-content"
        className={`mx-auto page-enter ${wide ? 'max-w-screen-2xl' : 'max-w-7xl'} ${noPadding ? '' : 'px-4 sm:px-6 py-6'}`}
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
