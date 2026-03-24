import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/store/i18nStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, GraduationCap } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || t.auth.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" aria-hidden="true" />

      {/* Theme/Language switchers — top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10 page-enter">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text font-accent mb-2">CIFRA</h1>
          <p className="text-text-muted text-sm">{t.auth.platformName}</p>
        </div>

        {/* Form Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-card" role="form" aria-label={t.auth.login}>
          <h2 className="text-lg font-bold mb-6">{t.auth.login}</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-start gap-2" role="alert">
              <span className="shrink-0 mt-0.5" aria-hidden="true">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@sgtu.ru"
              required
              autoComplete="email"
            />
            <Input
              label={t.auth.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.enterPassword}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<LogIn size={18} />}>
              {t.auth.loginButton}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center space-y-3">
            <Link to="/auth/register" className="block text-sm text-primary hover:text-primary-light transition-colors font-medium">
              {t.auth.registerLink}
            </Link>
            <p className="text-xs text-text-muted">
              {t.auth.guestHint}{' '}
              <a
                href="https://t.me/cifra_sgtu_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-light transition-colors"
              >
                {t.auth.telegramLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
