import { Header } from './Header';

interface PageLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
  noPadding?: boolean;
}

export function PageLayout({ children, wide = false, noPadding = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className={`mx-auto ${wide ? 'max-w-screen-2xl' : 'max-w-7xl'} ${noPadding ? '' : 'px-4 sm:px-6 py-6'}`}>
        {children}
      </main>
    </div>
  );
}
