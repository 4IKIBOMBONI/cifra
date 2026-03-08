import { Link } from 'react-router-dom';
import { Calendar, Star, Trophy, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  const { user } = useAuthStore();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-bg-surface to-secondary/20 border border-border p-8 md:p-12 mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-accent">
            Добро пожаловать в{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CIFRA
            </span>
          </h1>
          <p className="text-lg text-text-secondary mb-6 max-w-2xl">
            Платформа фиджитал-активностей СГТУ. Бронируй тренировки, участвуй в турнирах, прокачивай рейтинг и получай награды.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/schedule">
              <Button size="lg">
                <Calendar size={18} className="mr-2" />
                Записаться
              </Button>
            </Link>
            <Link to="/directions">
              <Button variant="secondary" size="lg">
                Направления <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative blur circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Quick stats */}
      {user && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card hover={false} className="text-center">
            <p className="text-text-muted text-sm mb-1">Мой рейтинг</p>
            <p className={`text-3xl font-bold font-accent ${
              user.rating_score < 30 ? 'text-error' :
              user.rating_score < 70 ? 'text-accent' : 'text-success'
            }`}>
              {user.rating_score}
            </p>
            <p className="text-xs text-text-muted mt-1">баллов</p>
          </Card>
          <Link to="/profile/bookings">
            <Card className="text-center h-full flex flex-col justify-center">
              <p className="text-text-muted text-sm mb-1">Мои бронирования</p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Calendar size={20} />
                <span className="text-sm">Посмотреть →</span>
              </div>
            </Card>
          </Link>
          <Link to="/teams">
            <Card className="text-center h-full flex flex-col justify-center">
              <p className="text-text-muted text-sm mb-1">Мои команды</p>
              <div className="flex items-center justify-center gap-2 text-secondary">
                <Trophy size={20} />
                <span className="text-sm">Перейти →</span>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Directions preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Направления</h2>
          <Link to="/directions" className="text-sm text-primary hover:text-primary-light">
            Все направления →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Киберспорт', icon: '🎮', color: '#6C5CE7', slug: 'cybersport' },
            { name: 'Лазертаг', icon: '🔫', color: '#FF6B6B', slug: 'lasertag' },
            { name: 'Дроны', icon: '🛸', color: '#00D2D3', slug: 'drones' },
            { name: 'PlayStation', icon: '🕹️', color: '#FECA57', slug: 'playstation' },
            { name: 'Компьютеры', icon: '💻', color: '#00B894', slug: 'computers' },
          ].map((dir) => (
            <Link key={dir.slug} to={`/directions/${dir.slug}`}>
              <Card className="text-center py-6">
                <div className="text-3xl mb-2">{dir.icon}</div>
                <p className="text-sm font-medium">{dir.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/news">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Star size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Новости и турниры</h3>
              <p className="text-sm text-text-secondary">Анонсы, результаты, мероприятия</p>
            </div>
          </Card>
        </Link>
        <Link to="/map">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">🗺️</span>
            </div>
            <div>
              <h3 className="font-semibold">Карта кампуса</h3>
              <p className="text-sm text-text-secondary">Найди площадку и запишись</p>
            </div>
          </Card>
        </Link>
      </section>
    </PageLayout>
  );
}
