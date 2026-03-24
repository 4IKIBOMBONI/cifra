import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/store/i18nStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus, GraduationCap } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', patronymic: '', student_id_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        patronymic: form.patronymic || undefined,
        student_id_number: form.student_id_number,
      });
      navigate('/');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail === 'Данные не найдены в базе студентов СГТУ') {
        setError('Данные не найдены. Проверьте правильность ФИО и номера студенческого билета.');
      } else {
        setError(detail || 'Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" aria-hidden="true" />

      {/* Theme/Language switchers */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10 page-enter">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text font-accent mb-2">CIFRA</h1>
          <p className="text-text-muted text-sm">{t.auth.platformName}</p>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-card" role="form" aria-label={t.auth.register}>
          <h2 className="text-lg font-bold mb-6">{t.auth.register}</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm" role="alert">
              {error}
              {error.includes('не найдены') && (
                <div className="mt-2">
                  <a
                    href="https://t.me/cifra_sgtu_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-secondary hover:text-secondary-light font-medium"
                  >
                    {t.auth.telegramLink} →
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label={t.auth.lastName} value={form.last_name} onChange={(e) => update('last_name', e.target.value)} placeholder="Иванов" required autoComplete="family-name" />
              <Input label={t.auth.firstName} value={form.first_name} onChange={(e) => update('first_name', e.target.value)} placeholder="Иван" required autoComplete="given-name" />
            </div>
            <Input label={t.auth.patronymic} value={form.patronymic} onChange={(e) => update('patronymic', e.target.value)} placeholder="Иванович" autoComplete="additional-name" />
            <Input
              label={t.auth.studentId}
              value={form.student_id_number}
              onChange={(e) => update('student_id_number', e.target.value)}
              placeholder="СТ-12345"
              required
            />
            <Input label={t.auth.email} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="ivanov@sgtu.ru" required autoComplete="email" />
            <Input label={t.auth.password} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder={t.auth.enterPassword} required autoComplete="new-password" />
            <Input label={t.auth.password} type="password" value={form.password_confirm} onChange={(e) => update('password_confirm', e.target.value)} placeholder={t.auth.enterPassword} required autoComplete="new-password" />

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<UserPlus size={18} />}>
              {t.auth.registerButton}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link to="/auth/login" className="text-sm text-primary hover:text-primary-light transition-colors font-medium">
              {t.auth.hasAccount} {t.auth.loginButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
