import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { analyticsApi } from '@/api';
import { ChevronLeft, TrendingUp, Users, Calendar, Compass } from 'lucide-react';

export function AdminAnalytics() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [popularity, setPopularity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      analyticsApi.directionsPopularity(),
    ]).then(([dRes, pRes]) => {
      setDashboard(dRes.data);
      setPopularity(pRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Аналитика</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-24" />)}
        </div>
      ) : (
        <>
          {/* Overview stats */}
          {dashboard && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Пользователей', value: dashboard.total_users, color: 'text-primary' },
                { icon: Calendar, label: 'Бронирований', value: dashboard.total_bookings, color: 'text-secondary' },
                { icon: TrendingUp, label: 'Слотов сегодня', value: dashboard.slots_today, color: 'text-accent' },
                { icon: Compass, label: 'Направлений', value: dashboard.total_directions, color: 'text-success' },
              ].map(s => (
                <Card key={s.label} hover={false} className="text-center">
                  <s.icon size={24} className={`mx-auto mb-2 ${s.color}`} />
                  <p className={`text-2xl font-bold font-accent ${s.color}`}>{s.value ?? '—'}</p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Directions popularity */}
          <h2 className="text-lg font-semibold mb-4">Популярность направлений</h2>
          {popularity.length === 0 ? (
            <p className="text-text-muted">Нет данных о популярности</p>
          ) : (
            <div className="space-y-3">
              {popularity.map((item: any, i: number) => {
                const maxCount = Math.max(...popularity.map((p: any) => p.booking_count || 0), 1);
                const pct = ((item.booking_count || 0) / maxCount) * 100;

                return (
                  <Card key={i} hover={false}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.direction_name || item.name || `Направление ${i + 1}`}</span>
                      <span className="font-bold font-accent">{item.booking_count || 0}</span>
                    </div>
                    <div className="w-full bg-bg-elevated rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
