import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { bookingsApi, slotsApi, directionsApi } from '@/api';
import type { Booking, Slot, Direction } from '@/types/api';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [directions, setDirections] = useState<Record<string, Direction>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookRes, dirRes] = await Promise.all([bookingsApi.my(), directionsApi.list()]);
      setBookings(bookRes.data);
      const dirMap: Record<string, Direction> = {};
      dirRes.data.forEach(d => { dirMap[d.id] = d; });
      setDirections(dirMap);
      const slotMap: Record<string, Slot> = {};
      await Promise.all(bookRes.data.map(async (b) => {
        try { const res = await slotsApi.get(b.slot_id); slotMap[b.slot_id] = res.data; } catch {}
      }));
      setSlots(slotMap);
    } catch {}
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Отменить бронирование?')) return;
    setCancellingId(id);
    try { await bookingsApi.cancel(id); await loadData(); } catch (err: any) { alert(err.response?.data?.detail || 'Ошибка'); }
    setCancellingId(null);
  };

  const now = new Date();
  const upcoming = bookings.filter(b => {
    const slot = slots[b.slot_id];
    if (!slot) return b.status === 'confirmed';
    return new Date(slot.date + 'T' + slot.end_time) > now && b.status === 'confirmed';
  });
  const past = bookings.filter(b => !upcoming.includes(b));
  const filtered = tab === 'upcoming' ? upcoming : past;

  const statusConfig: Record<string, { text: string; variant: 'success' | 'neutral' | 'primary' | 'error' }> = {
    confirmed: { text: 'Подтверждено', variant: 'success' },
    cancelled: { text: 'Отменено', variant: 'neutral' },
    completed: { text: 'Завершено', variant: 'primary' },
    no_show: { text: 'Неявка', variant: 'error' },
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Мои бронирования</h1>
        <p className="text-text-muted text-sm">История записей на занятия</p>
      </div>

      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'upcoming' as const, label: `Предстоящие (${upcoming.length})` },
          { key: 'past' as const, label: `Прошедшие (${past.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-primary text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Calendar size={28} />} title={tab === 'upcoming' ? 'Нет предстоящих' : 'Нет прошедших'} description="Записи на занятия появятся здесь" />
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => {
            const slot = slots[booking.slot_id];
            const dir = slot ? directions[slot.direction_id] : null;
            const sc = statusConfig[booking.status] || { text: booking.status, variant: 'neutral' as const };
            return (
              <Card key={booking.id} hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center text-2xl shrink-0">
                    {dir?.icon || '📅'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{dir?.name || 'Направление'}</p>
                    {slot && (
                      <p className="text-sm text-text-muted">
                        {new Date(slot.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
                        {' · '}{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                      </p>
                    )}
                    <Badge variant={sc.variant} className="mt-1">{sc.text}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {booking.status === 'confirmed' && tab === 'upcoming' && (
                    <Button variant="danger" size="sm" loading={cancellingId === booking.id} onClick={() => handleCancel(booking.id)}>Отменить</Button>
                  )}
                  {booking.status === 'completed' && booking.attended !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {booking.attended ? <CheckCircle size={16} className="text-success" /> : <XCircle size={16} className="text-error" />}
                      <span className={`text-sm font-medium ${booking.attended ? 'text-success' : 'text-error'}`}>
                        {booking.attended ? 'Присутствовал' : 'Не пришёл'}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
