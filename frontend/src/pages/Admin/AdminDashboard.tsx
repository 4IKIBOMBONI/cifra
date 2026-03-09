import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { analyticsApi } from '@/api';
import {
  Users, Calendar, Compass, MapPin, Monitor, Newspaper,
  BookOpen, Gift, Award, FileText, BarChart2, ClipboardList, Settings
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const links = [
    { to: '/admin/users', icon: Users, label: 'Пользователи', color: 'text-primary' },
    { to: '/admin/directions', icon: Compass, label: 'Направления', color: 'text-secondary' },
    { to: '/admin/slots', icon: Calendar, label: 'Слоты', color: 'text-accent' },
    { to: '/admin/resources', icon: Monitor, label: 'Ресурсы', color: 'text-success' },
    { to: '/admin/locations', icon: MapPin, label: 'Локации', color: 'text-primary' },
    { to: '/admin/news', icon: Newspaper, label: 'Новости', color: 'text-secondary' },
    { to: '/admin/materials', icon: BookOpen, label: 'Материалы', color: 'text-accent' },
    { to: '/admin/rewards', icon: Gift, label: 'Награды', color: 'text-error' },
    { to: '/admin/rating', icon: Award, label: 'Рейтинг', color: 'text-accent' },
    { to: '/admin/dksh', icon: FileText, label: 'ДКШ', color: 'text-primary' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Аналитика', color: 'text-success' },
    { to: '/admin/audit', icon: ClipboardList, label: 'Журнал', color: 'text-text-muted' },
  ];

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Пользователей', value: stats.total_users, color: 'text-primary' },
            { label: 'Бронирований', value: stats.total_bookings, color: 'text-secondary' },
            { label: 'Слотов сегодня', value: stats.slots_today, color: 'text-accent' },
            { label: 'Направлений', value: stats.total_directions, color: 'text-success' },
          ].map(s => (
            <Card key={s.label} hover={false} className="text-center">
              <p className={`text-3xl font-bold font-accent ${s.color}`}>{s.value ?? '—'}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </Card>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />
          ))}
        </div>
      )}

      {/* Admin Links */}
      <h2 className="text-lg font-semibold mb-4">Управление</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {links.map(link => (
          <Link key={link.to} to={link.to}>
            <Card className="flex flex-col items-center gap-2 py-6">
              <link.icon size={28} className={link.color} />
              <span className="text-sm font-medium">{link.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
