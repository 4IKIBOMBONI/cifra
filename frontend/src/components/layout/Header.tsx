import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User, Shield, ChevronDown, Gamepad2, Calendar, Trophy, Newspaper, BookOpen, Map, Gift } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { label: 'Направления', path: '/directions', icon: Gamepad2 },
  { label: 'Расписание', path: '/schedule', icon: Calendar },
  { label: 'Рейтинг', path: '/rating', icon: Trophy },
  { label: 'Новости', path: '/news', icon: Newspaper },
  { label: 'Материалы', path: '/materials', icon: BookOpen },
  { label: 'Карта', path: '/map', icon: Map },
  { label: 'Награды', path: '/rewards', icon: Gift },
];

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const ratingLevel =
    (user?.rating_score ?? 0) >= 100 ? { color: 'text-primary', bg: 'bg-primary/15', label: 'Элита' } :
    (user?.rating_score ?? 0) >= 70 ? { color: 'text-success', bg: 'bg-success/15', label: 'Продвинутый' } :
    (user?.rating_score ?? 0) >= 30 ? { color: 'text-accent', bg: 'bg-accent/15', label: 'Активный' } :
    { color: 'text-error', bg: 'bg-error/15', label: 'Новичок' };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold gradient-text font-accent hidden sm:block">
              CIFRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Rating */}
            <Link
              to="/rating"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${ratingLevel.bg} transition-colors`}
            >
              <Trophy size={14} className={ratingLevel.color} />
              <span className={`text-sm font-bold font-accent ${ratingLevel.color}`}>
                {user?.rating_score ?? 0}
              </span>
            </Link>

            {/* Notifications */}
            <Link
              to="/profile/notifications"
              className="relative p-2 hover:bg-bg-elevated rounded-lg transition-colors group"
            >
              <Bell size={18} className="text-text-muted group-hover:text-text-primary transition-colors" />
            </Link>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-text-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-bg-surface border border-border rounded-xl shadow-card animate-fade-in overflow-hidden">
                  <div className="px-4 py-3 bg-bg-elevated/50">
                    <p className="font-semibold text-sm truncate">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors">
                      <User size={16} /> Профиль
                    </Link>
                    <Link to="/teams" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors">
                      <Gamepad2 size={16} /> Мои команды
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors">
                        <Shield size={16} /> Админ-панель
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => { logout(); navigate('/auth/login'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                    >
                      <LogOut size={16} /> Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            >
              {menuOpen ? <X size={20} className="text-text-primary" /> : <Menu size={20} className="text-text-muted" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-border bg-bg-surface animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
