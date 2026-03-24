import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Gamepad2, Box, MapPin, Calendar,
  Newspaper, BookOpen, Gift, Trophy, GraduationCap, BarChart3,
  FileText, ArrowLeft
} from 'lucide-react';
import { Header } from './Header';
import { useI18n } from '@/store/i18nStore';

const ADMIN_NAV_CONFIG = [
  { key: 'dashboard' as const, path: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'users' as const, path: '/admin/users', icon: Users },
  { key: 'directions' as const, path: '/admin/directions', icon: Gamepad2 },
  { key: 'resources' as const, path: '/admin/resources', icon: Box },
  { key: 'locations' as const, path: '/admin/locations', icon: MapPin },
  { key: 'slots' as const, path: '/admin/slots', icon: Calendar },
  { key: 'news' as const, path: '/admin/news', icon: Newspaper },
  { key: 'materials' as const, path: '/admin/materials', icon: BookOpen },
  { key: 'rewards' as const, path: '/admin/rewards', icon: Gift },
  { key: 'rating' as const, path: '/admin/rating', icon: Trophy },
  { key: 'dksh' as const, path: '/admin/dksh', icon: GraduationCap },
  { key: 'analytics' as const, path: '/admin/analytics', icon: BarChart3 },
  { key: 'audit' as const, path: '/admin/audit', icon: FileText },
];

export function AdminLayout() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bg">
      <a href="#admin-content" className="skip-to-content">
        {t.nav.skipToContent}
      </a>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden md:flex flex-col w-60 border-r border-border bg-bg-surface/50 min-h-[calc(100vh-4rem)] sticky top-16"
          role="navigation"
          aria-label="Admin navigation"
        >
          <div className="p-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors mb-2"
            >
              <ArrowLeft size={16} />
              {t.nav.backToSite}
            </Link>
          </div>
          <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
            {ADMIN_NAV_CONFIG.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} className={active ? 'text-primary' : ''} />
                  {t.admin[item.key]}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main id="admin-content" className="flex-1 p-4 sm:p-6 max-w-6xl page-enter" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
