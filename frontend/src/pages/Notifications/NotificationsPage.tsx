import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { notificationsApi } from '@/api';
import type { Notification } from '@/types/api';
import { Bell, Check, CheckCheck } from 'lucide-react';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.list(filter === 'unread' ? { unread_only: true } : {});
      setNotifications(res.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* ignore */ }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const typeIcon = (type: string) => {
    const map: Record<string, string> = {
      booking_confirmed: '📅',
      booking_cancelled: '❌',
      booking_reminder: '⏰',
      rating_change: '⭐',
      reward_issued: '🎁',
      team_invite: '👥',
      system: '🔔',
    };
    return map[type] || '🔔';
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck size={16} className="mr-1" />
            Прочитать все
          </Button>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'all' as const, label: 'Все' },
          { key: 'unread' as const, label: `Непрочитанные${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === t.key ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Нет уведомлений</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => (
            <Card
              key={notif.id}
              hover={false}
              className={`flex items-start gap-3 ${!notif.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <span className="text-xl shrink-0">{typeIcon(notif.type)}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.is_read ? 'font-semibold' : ''}`}>{notif.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{notif.message}</p>
              </div>
              {!notif.is_read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-text-muted hover:text-primary transition-colors shrink-0"
                  title="Отметить как прочитанное"
                >
                  <Check size={16} />
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
