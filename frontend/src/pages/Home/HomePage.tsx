import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ArrowRight, Zap, BookOpen, Map as MapIcon, Star, TrendingUp, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

  const ratingLevel =
    (user?.rating_score ?? 0) >= 100 ? { color: 'text-primary', label: 'Элита' } :
    (user?.rating_score ?? 0) >= 70 ? { color: 'text-success', label: 'Продвинутый' } :
    (user?.rating_score ?? 0) >= 30 ? { color: 'text-accent', label: 'Активный' } :
    { color: 'text-error', label: 'Новичок' };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-hero border border-border p-8 md:p-12 mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="primary" size="md">Платформа СГТУ</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-accent leading-tight">
            Добро пожаловать в{' '}
            <span className="gradient-text">CIFRA</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary mb-8 max-w-2xl leading-relaxed">
            Бронируй тренировки, участвуй в турнирах, прокачивай рейтинг и получай награды.
            Единая платформа фиджитал-активностей университета.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/schedule">
              <Button size="lg" icon={<Calendar size={18} />}>
                Записаться на занятие
              </Button>
            </Link>
            <Link to="/directions">
              <Button variant="secondary" size="lg">
                Все направления <ArrowRight size={18} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary/8 blur-[100px]" />
      </section>

      {/* Quick stats */}
      {user && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card hover={false} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Мой рейтинг</p>
                <p className={`text-3xl font-bold font-accent ${ratingLevel.color}`}>
                  {user.rating_score}
                </p>
                <p className="text-xs text-text-muted mt-1">{ratingLevel.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
            </div>
          </Card>
          <Link to="/profile/bookings">
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">Бронирования</p>
                  <p className="text-sm text-text-primary font-medium mt-2">Посмотреть расписание</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Calendar size={20} className="text-secondary" />
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/teams">
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">Мои команды</p>
                  <p className="text-sm text-text-primary font-medium mt-2">Управление командами</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Trophy size={20} className="text-accent" />
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Directions */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Направления</h2>
          <Link to="/directions" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
            Все направления →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(directions.length > 0 ? directions : [
            { name: 'Киберспорт', icon: '🎮', slug: 'cybersport', color: '#2563EB' },
            { name: 'Лазертаг', icon: '🔫', slug: 'lasertag', color: '#EF4444' },
            { name: 'Дроны', icon: '🛸', slug: 'drones', color: '#10B981' },
            { name: 'PlayStation', icon: '🕹️', slug: 'playstation', color: '#8B5CF6' },
            { name: 'Компьютеры', icon: '💻', slug: 'computers', color: '#06B6D4' },
          ] as any[]).map((dir) => (
            <Link key={dir.slug} to={`/directions/${dir.slug}`}>
              <Card className="text-center py-6 group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{dir.icon}</div>
                <p className="text-sm font-semibold text-text-primary">{dir.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming slots */}
      {slots.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Ближайшие слоты</h2>
            <Link to="/schedule" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
              Расписание →
            </Link>
          </div>
          <div className="space-y-2">
            {slots.map(slot => (
              <Card key={slot.id} hover={false} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{dirName(slot.direction_id) || 'Занятие'}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm text-text-secondary font-mono">{slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}</span>
                      <span className="text-xs text-text-muted">{slot.current_count}/{slot.capacity} мест</span>
                    </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Новости</h2>
            <Link to="/news" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">Все →</Link>
          </div>
          {news.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-6">Нет новостей</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {news.map(post => (
                <Link key={post.id} to={`/news/${post.slug}`}>
                  <Card className="group">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={post.type === 'news' ? 'primary' : post.type === 'announcement' ? 'warning' : 'success'}>
                        {post.type === 'news' ? 'Новость' : post.type === 'announcement' ? 'Анонс' : 'Результат'}
                      </Badge>
                      {post.published_at && (
                        <span className="text-xs text-text-muted">
                          {new Date(post.published_at).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{post.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Топ-5 рейтинга</h2>
            <Link to="/rating" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">Лидерборд →</Link>
          </div>
          {leaderboard.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-6">Нет данных</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <Card
                  key={entry.user_id}
                  hover={false}
                  className={`flex items-center gap-3 ${entry.user_id === user?.id ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold font-accent text-sm ${
                    i === 0 ? 'bg-accent/15 text-accent' :
                    i === 1 ? 'bg-text-secondary/15 text-text-secondary' :
                    i === 2 ? 'bg-warning/15 text-warning' :
                    'bg-bg-elevated text-text-muted'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {entry.first_name[0]}{entry.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.first_name} {entry.last_name}</p>
                  </div>
                  <span className="font-bold font-accent text-primary">{entry.rating_score}</span>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { to: '/materials', icon: <BookOpen size={22} />, color: 'primary', title: 'Материалы', desc: 'Лекции, видео, ссылки' },
          { to: '/map', icon: <MapIcon size={22} />, color: 'secondary', title: 'Карта кампуса', desc: 'Найди площадку' },
          { to: '/rewards', icon: <Star size={22} />, color: 'accent', title: 'Награды', desc: 'Обменяй баллы' },
          { to: '/schedule', icon: <Zap size={22} />, color: 'success', title: 'Расписание', desc: 'Запись на занятия' },
        ].map(link => (
          <Link key={link.to} to={link.to}>
            <Card className="group">
              <div className={`w-11 h-11 rounded-xl bg-${link.color}/10 flex items-center justify-center mb-3 text-${link.color} group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <h3 className="font-semibold text-sm mb-0.5">{link.title}</h3>
              <p className="text-xs text-text-muted">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </section>
    </PageLayout>
  );
}
