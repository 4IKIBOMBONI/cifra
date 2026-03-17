import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Gamepad2, Box, MapPin, Calendar,
  Newspaper, BookOpen, Gift, Trophy, GraduationCap, BarChart3,
  FileText, ArrowLeft
} from 'lucide-react';
import { Header } from './Header';

const ADMIN_NAV = [
  { label: 'Дашборд', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Пользователи', path: '/admin/users', icon: Users },
  { label: 'Направления', path: '/admin/directions', icon: Gamepad2 },
  { label: 'Ресурсы', path: '/admin/resources', icon: Box },
  { label: 'Площадки', path: '/admin/locations', icon: MapPin },
  { label: 'Слоты', path: '/admin/slots', icon: Calendar },
  { label: 'Новости', path: '/admin/news', icon: Newspaper },
  { label: 'Материалы', path: '/admin/materials', icon: BookOpen },
  { label: 'Награды', path: '/admin/rewards', icon: Gift },
  { label: 'Рейтинг', path: '/admin/rating', icon: Trophy },
  { label: 'ДКШП', path: '/admin/dksh', icon: GraduationCap },
  { label: 'Аналитика', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Аудит', path: '/admin/audit', icon: FileText },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 border-r border-border bg-bg-surface/50 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors mb-2"
            >
              <ArrowLeft size={16} />
              На сайт
            </Link>
          </div>
          <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
            {ADMIN_NAV.map((item) => {
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
                >
                  <Icon size={18} className={active ? 'text-primary' : ''} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
