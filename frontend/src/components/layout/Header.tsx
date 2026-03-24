import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User, Shield, ChevronDown, Gamepad2, Calendar, Trophy, Newspaper, BookOpen, Map, Gift } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/store/i18nStore';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const NAV_ICONS = {
  directions: Gamepad2,
  schedule: Calendar,
  rating: Trophy,
  news: Newspaper,
  materials: BookOpen,
  map: Map,
  rewards: Gift,
};

export function Header() {
  const { user, logout } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const NAV_ITEMS = [
    { label: t.nav.directions, path: '/directions', icon: NAV_ICONS.directions },
    { label: t.nav.schedule, path: '/schedule', icon: NAV_ICONS.schedule },
    { label: t.nav.rating, path: '/rating', icon: NAV_ICONS.rating },
    { label: t.nav.news, path: '/news', icon: NAV_ICONS.news },
    { label: t.nav.materials, path: '/materials', icon: NAV_ICONS.materials },
    { label: t.nav.map, path: '/map', icon: NAV_ICONS.map },
    { label: t.nav.rewards, path: '/rewards', icon: NAV_ICONS.rewards },
  ];

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

  // Close menu on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const ratingScore = user?.rating_score ?? 0;
  const ratingLevel =
    ratingScore >= 100 ? { color: 'text-primary', bg: 'bg-primary/15', label: t.ratingLevels.elite } :
    ratingScore >= 70 ? { color: 'text-success', bg: 'bg-success/15', label: t.ratingLevels.advanced } :
    ratingScore >= 30 ? { color: 'text-accent', bg: 'bg-accent/15', label: t.ratingLevels.active } :
    { color: 'text-error', bg: 'bg-error/15', label: t.ratingLevels.beginner };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 glass" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="CIFRA — Home">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold gradient-text font-accent hidden sm:block">
              CIFRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label={t.a11y.mainNavigation}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1.5">
            {/* Theme & Language switchers */}
            <div className="hidden md:flex items-center gap-1.5">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>

            {/* Rating */}
            <Link
              to="/rating"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${ratingLevel.bg} transition-colors`}
              aria-label={`${t.a11y.ratingScore}: ${ratingScore}`}
            >
              <Trophy size={14} className={ratingLevel.color} />
              <span className={`text-sm font-bold font-accent ${ratingLevel.color}`}>
                {ratingScore}
              </span>
            </Link>

            {/* Notifications */}
            <Link
              to="/profile/notifications"
              className="relative p-2 hover:bg-bg-elevated rounded-lg transition-colors group"
              aria-label={t.a11y.notifications}
            >
              <Bell size={18} className="text-text-muted group-hover:text-text-primary transition-colors" />
            </Link>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label={t.a11y.openProfile}
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  </div>
                )}
                <ChevronDown size={14} className={`text-text-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-bg-surface border border-border rounded-xl shadow-card animate-fade-in overflow-hidden"
                  role="menu"
                >
                  <div className="px-4 py-3 bg-bg-elevated/50">
                    <p className="font-semibold text-sm truncate">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors" role="menuitem">
                      <User size={16} /> {t.nav.profile}
                    </Link>
                    <Link to="/teams" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors" role="menuitem">
                      <Gamepad2 size={16} /> {t.nav.myTeams}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors" role="menuitem">
                        <Shield size={16} /> {t.nav.adminPanel}
                      </Link>
                    )}
                  </div>
                  {/* Mobile theme/language switchers */}
                  <div className="md:hidden border-t border-border px-4 py-2 flex items-center gap-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => { logout(); navigate('/auth/login'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                      role="menuitem"
                    >
                      <LogOut size={16} /> {t.nav.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-bg-elevated rounded-lg transition-colors"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            >
              {menuOpen ? <X size={20} className="text-text-primary" /> : <Menu size={20} className="text-text-muted" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="lg:hidden border-t border-border bg-bg-surface animate-slide-down"
          aria-label={t.a11y.mainNavigation}
        >
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
                  aria-current={isActive(item.path) ? 'page' : undefined}
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
