import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { label: 'Направления', path: '/directions' },
  { label: 'Расписание', path: '/schedule' },
  { label: 'Рейтинг', path: '/rating' },
  { label: 'Новости', path: '/news' },
  { label: 'Материалы', path: '/materials' },
  { label: 'Карта', path: '/map' },
  { label: 'Награды', path: '/rewards' },
];

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const ratingColor =
    (user?.rating_score ?? 0) < 30 ? 'text-error' :
    (user?.rating_score ?? 0) < 70 ? 'text-accent' :
    (user?.rating_score ?? 0) < 100 ? 'text-success' : 'text-primary';

  return (
    <header className="sticky top-0 z-50 bg-bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-accent">
            CIFRA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Rating badge */}
          <Link to="/rating" className={`hidden sm:flex items-center gap-1 font-accent font-bold ${ratingColor}`}>
            {user?.rating_score ?? 0}
            <span className="text-xs text-text-muted">pts</span>
          </Link>

          {/* Notifications */}
          <Link to="/profile/notifications" className="relative p-2 hover:bg-bg-elevated rounded-lg transition-colors">
            <Bell size={20} className="text-text-secondary" />
          </Link>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-bg-surface border border-border rounded-lg shadow-lg py-2 animate-fadeIn">
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-bg-elevated" onClick={() => setProfileOpen(false)}>
                  <User size={16} /> Профиль
                </Link>
                <Link to="/teams" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-bg-elevated" onClick={() => setProfileOpen(false)}>
                  <Settings size={16} /> Команды
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-bg-elevated" onClick={() => setProfileOpen(false)}>
                    <Settings size={16} /> Админ-панель
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/auth/login'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-bg-elevated"
                >
                  <LogOut size={16} /> Выйти
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 hover:bg-bg-elevated rounded-lg">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden bg-bg-surface border-t border-border animate-slideUp">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-6 py-3 text-text-secondary hover:text-white hover:bg-bg-elevated border-b border-border/50"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
