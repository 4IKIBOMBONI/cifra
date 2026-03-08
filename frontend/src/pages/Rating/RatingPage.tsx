import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { ratingApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { RatingEvent, LeaderboardEntry } from '@/types/api';

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
    if (score < 0) return { label: 'Заблокирован', color: 'text-error', slots: 0 };
    if (score < 30) return { label: 'Начинающий', color: 'text-error', slots: 1 };
    if (score < 70) return { label: 'Активный', color: 'text-accent', slots: 3 };
    if (score < 100) return { label: 'Продвинутый', color: 'text-success', slots: 5 };
    return { label: 'Элита', color: 'text-primary', slots: 5 };
  };

  const level = ratingLevel(user?.rating_score ?? 0);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Рейтинг</h1>

      {/* My rating card */}
      <Card hover={false} className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center">
            <p className={`text-5xl font-bold font-accent ${level.color} glow-text`}>
              {user?.rating_score ?? 0}
            </p>
            <p className="text-sm text-text-muted mt-1">баллов</p>
          </div>
          <div className="flex-1">
            <p className={`text-lg font-semibold ${level.color}`}>{level.label}</p>
            <p className="text-sm text-text-secondary">Лимит: {level.slots} слотов в неделю</p>
            {/* Progress bar */}
            <div className="mt-3 w-full bg-bg-elevated rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (user?.rating_score ?? 0)))}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'leaderboard' as const, label: 'Лидерборд' },
          { key: 'history' as const, label: 'История' },
          { key: 'rules' as const, label: 'Правила' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'leaderboard' && (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <Card
              key={entry.user_id}
              hover={false}
              className={`flex items-center gap-4 ${entry.user_id === user?.id ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <span className="text-lg font-bold font-accent w-8 text-center text-text-muted">
                {entry.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {entry.first_name[0]}{entry.last_name[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{entry.first_name} {entry.last_name}</p>
              </div>
              <span className="font-bold font-accent text-lg">{entry.rating_score}</span>
            </Card>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-text-muted text-center py-8">Пока нет изменений рейтинга</p>
          ) : history.map((event) => (
            <Card key={event.id} hover={false} className="flex items-center justify-between">
              <div>
                <p className="text-sm">{event.reason}</p>
                <p className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString('ru-RU')}</p>
              </div>
              <div className="text-right">
                <span className={`font-bold font-accent ${event.points > 0 ? 'text-success' : 'text-error'}`}>
                  {event.points > 0 ? '+' : ''}{event.points}
                </span>
                <p className="text-xs text-text-muted">→ {event.balance_after}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'rules' && (
        <Card hover={false}>
          <h3 className="text-lg font-bold mb-4">Правила начисления баллов</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-success mb-2">Начисление</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border"><td className="py-2">Посещение занятия</td><td className="text-right text-success font-accent">+10</td></tr>
                  <tr className="border-b border-border"><td className="py-2">Участие в турнире</td><td className="text-right text-success font-accent">+20</td></tr>
                  <tr className="border-b border-border"><td className="py-2">Достижение</td><td className="text-right text-success font-accent">+50</td></tr>
                  <tr><td className="py-2">Полезное действие</td><td className="text-right text-success font-accent">+5–30</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-semibold text-error mb-2">Списание</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border"><td className="py-2">Неявка</td><td className="text-right text-error font-accent">−20</td></tr>
                  <tr className="border-b border-border"><td className="py-2">Поздняя отмена</td><td className="text-right text-error font-accent">−10</td></tr>
                  <tr><td className="py-2">Нарушение</td><td className="text-right text-error font-accent">−30</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Лимиты бронирований</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border"><td className="py-2">Менее 0 баллов</td><td className="text-right text-error">Блокировка</td></tr>
                  <tr className="border-b border-border"><td className="py-2">0–29 баллов</td><td className="text-right">1 слот/нед</td></tr>
                  <tr className="border-b border-border"><td className="py-2">30–69 баллов</td><td className="text-right">3 слота/нед</td></tr>
                  <tr><td className="py-2">70+ баллов</td><td className="text-right">5 слотов/нед</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
