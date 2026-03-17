import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ratingApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { RatingEvent, LeaderboardEntry } from '@/types/api';
import { Trophy, TrendingUp, TrendingDown, Award } from 'lucide-react';

export function RatingPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'leaderboard' | 'history' | 'rules'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<RatingEvent[]>([]);

  useEffect(() => {
    ratingApi.leaderboard(20).then(res => setLeaderboard(res.data)).catch(() => {});
    ratingApi.myHistory(50).then(res => setHistory(res.data)).catch(() => {});
  }, []);

  const ratingLevel = (score: number) => {
    if (score < 0) return { label: 'Заблокирован', color: 'text-error', bg: 'bg-error/10', slots: 0 };
    if (score < 30) return { label: 'Начинающий', color: 'text-error', bg: 'bg-error/10', slots: 1 };
    if (score < 70) return { label: 'Активный', color: 'text-accent', bg: 'bg-accent/10', slots: 3 };
    if (score < 100) return { label: 'Продвинутый', color: 'text-success', bg: 'bg-success/10', slots: 5 };
    return { label: 'Элита', color: 'text-primary', bg: 'bg-primary/10', slots: 5 };
  };

  const level = ratingLevel(user?.rating_score ?? 0);

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Рейтинг</h1>
        <p className="text-text-muted text-sm">Зарабатывай баллы, соревнуйся с другими</p>
      </div>

      {/* My rating card */}
      <Card hover={false} className="mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-[60px]" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="text-center">
            <p className={`text-5xl font-bold font-accent ${level.color}`}>
              {user?.rating_score ?? 0}
            </p>
            <p className="text-sm text-text-muted mt-1">баллов</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={level.color.includes('error') ? 'error' : level.color.includes('accent') ? 'warning' : level.color.includes('success') ? 'success' : 'primary'} size="md">
                {level.label}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">Лимит: {level.slots} слотов в неделю</p>
            <div className="mt-3 w-full bg-bg-elevated rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (user?.rating_score ?? 0)))}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'leaderboard' as const, label: 'Лидерборд', icon: <Trophy size={14} /> },
          { key: 'history' as const, label: 'История', icon: <TrendingUp size={14} /> },
          { key: 'rules' as const, label: 'Правила', icon: <Award size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t.key ? 'bg-primary text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <EmptyState icon={<Trophy size={28} />} title="Нет данных" description="Лидерборд пока пуст" />
          ) : leaderboard.map((entry, i) => (
            <Card
              key={entry.user_id}
              hover={false}
              className={`flex items-center gap-4 ${entry.user_id === user?.id ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold font-accent text-sm ${
                i === 0 ? 'bg-accent/15 text-accent' :
                i === 1 ? 'bg-text-secondary/15 text-text-secondary' :
                i === 2 ? 'bg-warning/15 text-warning' :
                'bg-bg-elevated text-text-muted'
              }`}>
                {entry.rank}
              </div>
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">
                  {entry.first_name[0]}{entry.last_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entry.first_name} {entry.last_name}</p>
              </div>
              <span className="font-bold font-accent text-lg text-primary">{entry.rating_score}</span>
            </Card>
          ))}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <EmptyState icon={<TrendingUp size={28} />} title="Нет изменений" description="Ваш рейтинг ещё не менялся" />
          ) : history.map((event) => (
            <Card key={event.id} hover={false} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${event.points > 0 ? 'bg-success/10' : 'bg-error/10'}`}>
                  {event.points > 0 ? <TrendingUp size={18} className="text-success" /> : <TrendingDown size={18} className="text-error" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{event.reason}</p>
                  <p className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString('ru-RU')}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-bold font-accent ${event.points > 0 ? 'text-success' : 'text-error'}`}>
                  {event.points > 0 ? '+' : ''}{event.points}
                </span>
                <p className="text-xs text-text-muted">Баланс: {event.balance_after}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rules */}
      {tab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hover={false}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-success" /> Начисление баллов
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Посещение занятия', points: '+10' },
                { action: 'Участие в турнире', points: '+20' },
                { action: 'Достижение', points: '+50' },
                { action: 'Полезное действие', points: '+5–30' },
              ].map(r => (
                <div key={r.action} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{r.action}</span>
                  <span className="text-sm font-bold font-accent text-success">{r.points}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card hover={false}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingDown size={18} className="text-error" /> Списание баллов
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Неявка', points: '−20' },
                { action: 'Поздняя отмена', points: '−10' },
                { action: 'Нарушение', points: '−30' },
              ].map(r => (
                <div key={r.action} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{r.action}</span>
                  <span className="text-sm font-bold font-accent text-error">{r.points}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card hover={false} className="md:col-span-2">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Award size={18} className="text-primary" /> Уровни и лимиты
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: 'Начинающий', range: '0–29', slots: '1 слот/нед', color: 'error' },
                { level: 'Активный', range: '30–69', slots: '3 слота/нед', color: 'warning' },
                { level: 'Продвинутый', range: '70–99', slots: '5 слотов/нед', color: 'success' },
                { level: 'Элита', range: '100+', slots: '5 слотов/нед', color: 'primary' },
              ].map(l => (
                <div key={l.level} className={`p-3 rounded-lg bg-${l.color}/5 border border-${l.color}/10`}>
                  <p className={`font-semibold text-sm text-${l.color}`}>{l.level}</p>
                  <p className="text-xs text-text-muted mt-1">{l.range} баллов</p>
                  <p className="text-xs text-text-secondary mt-0.5">{l.slots}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
