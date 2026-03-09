import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Trophy, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { newsApi, slotsApi, ratingApi, directionsApi } from '@/api';
import type { NewsPost, Slot, LeaderboardEntry, Direction } from '@/types/api';

export function HomePage() {
  const { user } = useAuthStore();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      newsApi.list().catch(() => ({ data: [] })),
      slotsApi.list({ slot_date: today, status: 'available' }).catch(() => ({ data: [] })),
      ratingApi.leaderboard(5).catch(() => ({ data: [] })),
      directionsApi.list().catch(() => ({ data: [] })),
    ]).then(([nRes, sRes, lRes, dRes]) => {
      setNews((nRes.data as NewsPost[]).slice(0, 3));
      setSlots((sRes.data as Slot[]).slice(0, 5));
      setLeaderboard(lRes.data as LeaderboardEntry[]);
      setDirections(dRes.data as Direction[]);
    });
  }, []);

  const dirName = (id: string) => directions.find(d => d.id === id)?.name || '';

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
                <span className="text-sm">Посмотреть</span>
              </div>
            </Card>
          </Link>
          <Link to="/teams">
            <Card className="text-center h-full flex flex-col justify-center">
              <p className="text-text-muted text-sm mb-1">Мои команды</p>
              <div className="flex items-center justify-center gap-2 text-secondary">
                <Trophy size={20} />
                <span className="text-sm">Перейти</span>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Directions */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Направления</h2>
          <Link to="/directions" className="text-sm text-primary hover:text-primary-light">Все →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(directions.length > 0 ? directions : [
            { name: 'Киберспорт', icon: '🎮', slug: 'cybersport' },
            { name: 'Лазертаг', icon: '🔫', slug: 'lasertag' },
            { name: 'Дроны', icon: '🛸', slug: 'drones' },
            { name: 'PlayStation', icon: '🕹️', slug: 'playstation' },
            { name: 'Компьютеры', icon: '💻', slug: 'computers' },
          ] as any[]).map((dir) => (
            <Link key={dir.slug} to={`/directions/${dir.slug}`}>
              <Card className="text-center py-6">
                <div className="text-3xl mb-2">{dir.icon}</div>
                <p className="text-sm font-medium">{dir.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming slots */}
      {slots.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ближайшие свободные слоты</h2>
            <Link to="/schedule" className="text-sm text-primary hover:text-primary-light">Расписание →</Link>
          </div>
          <div className="space-y-2">
            {slots.map(slot => (
              <Card key={slot.id} hover={false} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="font-bold font-accent">{slot.start_time.slice(0, 5)}</p>
                    <p className="text-xs text-text-muted">{slot.end_time.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{dirName(slot.direction_id) || 'Занятие'}</p>
                    <p className="text-xs text-text-muted">{slot.current_count}/{slot.capacity} мест</p>
                  </div>
                </div>
                <Link to="/schedule">
                  <Button size="sm">Записаться</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* News */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Новости</h2>
            <Link to="/news" className="text-sm text-primary hover:text-primary-light">Все →</Link>
          </div>
          {news.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-4">Нет новостей</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {news.map(post => (
                <Link key={post.id} to={`/news/${post.slug}`}>
                  <Card className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge bg-primary/10 text-primary text-xs">
                        {post.type === 'news' ? 'Новость' : post.type === 'announcement' ? 'Анонс' : 'Результат'}
                      </span>
                      {post.published_at && (
                        <span className="text-xs text-text-muted">
                          {new Date(post.published_at).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{post.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Топ-5 рейтинга</h2>
            <Link to="/rating" className="text-sm text-primary hover:text-primary-light">Лидерборд →</Link>
          </div>
          {leaderboard.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-4">Нет данных</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map(entry => (
                <Card
                  key={entry.user_id}
                  hover={false}
                  className={`flex items-center gap-3 ${entry.user_id === user?.id ? 'border-primary/50 bg-primary/5' : ''}`}
                >
                  <span className="text-lg font-bold font-accent w-6 text-center text-text-muted">
                    {entry.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {entry.first_name[0]}{entry.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.first_name} {entry.last_name}</p>
                  </div>
                  <span className="font-bold font-accent">{entry.rating_score}</span>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Link to="/materials">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Star size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Материалы и инструкции</h3>
              <p className="text-sm text-text-secondary">Лекции, видео, полезные ссылки</p>
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
