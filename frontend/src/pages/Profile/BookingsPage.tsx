import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { bookingsApi, slotsApi, directionsApi } from '@/api';
import type { Booking, Slot, Direction } from '@/types/api';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [directions, setDirections] = useState<Record<string, Direction>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookRes, dirRes] = await Promise.all([
        bookingsApi.my(),
        directionsApi.list(),
      ]);
      setBookings(bookRes.data);

      const dirMap: Record<string, Direction> = {};
      dirRes.data.forEach(d => { dirMap[d.id] = d; });
      setDirections(dirMap);

      // Load slot details for each booking
      const slotMap: Record<string, Slot> = {};
      await Promise.all(
        bookRes.data.map(async (b) => {
          try {
            const res = await slotsApi.get(b.slot_id);
            slotMap[b.slot_id] = res.data;
          } catch { /* skip */ }
        })
      );
      setSlots(slotMap);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Отменить бронирование?')) return;
    setCancellingId(id);
    try {
      await bookingsApi.cancel(id);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка отмены');
    }
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

  const statusLabel = (status: string) => {
    const m: Record<string, { text: string; cls: string }> = {
      confirmed: { text: 'Подтверждено', cls: 'text-success' },
      cancelled: { text: 'Отменено', cls: 'text-text-muted' },
      completed: { text: 'Завершено', cls: 'text-primary' },
      no_show: { text: 'Неявка', cls: 'text-error' },
    };
    return m[status] || { text: status, cls: 'text-text-muted' };
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'upcoming' as const, label: `Предстоящие (${upcoming.length})` },
          { key: 'past' as const, label: `Прошедшие (${past.length})` },
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

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">{tab === 'upcoming' ? 'Нет предстоящих бронирований' : 'Нет прошедших бронирований'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => {
            const slot = slots[booking.slot_id];
            const dir = slot ? directions[slot.direction_id] : null;
            const st = statusLabel(booking.status);

            return (
              <Card key={booking.id} hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {dir && (
                    <div className="text-2xl">{dir.icon}</div>
                  )}
                  <div>
                    <p className="font-medium">{dir?.name || 'Направление'}</p>
                    {slot && (
                      <div className="text-sm text-text-muted">
                        {new Date(slot.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
                        {' '}{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                      </div>
                    )}
                    <span className={`text-xs font-medium ${st.cls}`}>{st.text}</span>
                  </div>
                </div>
                {booking.status === 'confirmed' && tab === 'upcoming' && (
                  <Button
                    variant="danger"
                    size="sm"
                    loading={cancellingId === booking.id}
                    onClick={() => handleCancel(booking.id)}
                  >
                    Отменить
                  </Button>
                )}
                {booking.status === 'completed' && booking.attended !== undefined && (
                  <span className={`text-sm font-medium ${booking.attended ? 'text-success' : 'text-error'}`}>
                    {booking.attended ? 'Присутствовал' : 'Не пришёл'}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
