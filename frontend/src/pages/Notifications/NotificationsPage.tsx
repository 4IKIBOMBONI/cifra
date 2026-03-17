import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { notificationsApi } from '@/api';
import type { Notification } from '@/types/api';
import { Bell, Check, CheckCheck, Calendar, Star, Gift, Users, AlertCircle, X } from 'lucide-react';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => { loadNotifications(); }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.list(filter === 'unread' ? { unread_only: true } : {});
      setNotifications(res.data);
    } catch {}
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    try { await notificationsApi.markRead(id); setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n)); } catch {}
  };

  const handleMarkAllRead = async () => {
    try { await notificationsApi.markAllRead(); setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); } catch {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    booking_confirmed: { icon: <Calendar size={18} />, color: 'text-success' },
    booking_cancelled: { icon: <X size={18} />, color: 'text-error' },
    booking_reminder: { icon: <Bell size={18} />, color: 'text-warning' },
    rating_change: { icon: <Star size={18} />, color: 'text-accent' },
    reward_issued: { icon: <Gift size={18} />, color: 'text-primary' },
    team_invite: { icon: <Users size={18} />, color: 'text-secondary' },
    system: { icon: <AlertCircle size={18} />, color: 'text-text-muted' },
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Уведомления</h1>
          <p className="text-text-muted text-sm">{unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Всё прочитано'}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} icon={<CheckCheck size={16} />}>
            Прочитать все
          </Button>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'all' as const, label: 'Все' },
          { key: 'unread' as const, label: `Непрочитанные${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === t.key ? 'bg-primary text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-16" />)}</div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="Нет уведомлений" description="Здесь появятся уведомления о бронированиях и рейтинге" />
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const tc = typeConfig[notif.type] || typeConfig.system;
            return (
              <Card key={notif.id} hover={false} className={`flex items-start gap-3 ${!notif.is_read ? 'border-primary/20 bg-primary/3' : ''}`}>
                <div className={`w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 ${tc.color}`}>
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.is_read ? 'font-semibold' : 'text-text-secondary'}`}>{notif.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{notif.message}</p>
                </div>
                {!notif.is_read && (
                  <button onClick={() => handleMarkRead(notif.id)} className="text-text-muted hover:text-primary transition-colors shrink-0 p-1" title="Прочитано">
                    <Check size={16} />
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
