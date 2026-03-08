import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-accent mb-2">
            CIFRA
          </h1>
          <p className="text-text-secondary">Цифровой ВУЗ — платформа фиджитал-активностей</p>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Вход</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@sgtu.ru"
              required
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/auth/register" className="text-sm text-primary hover:text-primary-light">
              Регистрация для студентов СГТУ
            </Link>
            <div className="text-sm text-text-muted">
              Школьник или гость?{' '}
              <a
                href="https://t.me/cifra_sgtu_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-light"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
