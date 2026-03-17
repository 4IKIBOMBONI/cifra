import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus, GraduationCap } from 'lucide-react';

export function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', patronymic: '', student_id_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src="/images/logo.svg" alt="CIFRA" className="w-16 h-16 rounded-2xl mx-auto shadow-glow mb-4" />
          <h1 className="text-3xl font-bold gradient-text font-accent mb-2">CIFRA</h1>
          <p className="text-text-muted text-sm">Регистрация студента СГТУ</p>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-bold mb-6">Создание аккаунта</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
              {error.includes('не найдены') && (
                <div className="mt-2">
                  <a
                    href="https://t.me/cifra_sgtu_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-secondary hover:text-secondary-light font-medium"
                  >
                    Написать в поддержку →
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Фамилия" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} placeholder="Иванов" required />
              <Input label="Имя" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} placeholder="Иван" required />
            </div>
            <Input label="Отчество" value={form.patronymic} onChange={(e) => update('patronymic', e.target.value)} placeholder="Иванович" />
            <Input
              label="Номер студенческого билета"
              value={form.student_id_number}
              onChange={(e) => update('student_id_number', e.target.value)}
              placeholder="СТ-12345"
              hint="Используется для верификации"
              required
            />
            <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="ivanov@sgtu.ru" required />
            <Input label="Пароль" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Минимум 6 символов" required />
            <Input label="Подтверждение пароля" type="password" value={form.password_confirm} onChange={(e) => update('password_confirm', e.target.value)} placeholder="Повторите пароль" required />

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<UserPlus size={18} />}>
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link to="/auth/login" className="text-sm text-primary hover:text-primary-light transition-colors font-medium">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
