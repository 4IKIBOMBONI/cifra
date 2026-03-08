import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { slotsApi, bookingsApi, directionsApi } from '@/api';
import type { Slot, Direction } from '@/types/api';
import { useAuthStore } from '@/store/authStore';

export function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    directionsApi.list().then(res => setDirections(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { slot_date: selectedDate };
    if (selectedDirection) params.direction_id = selectedDirection;
    slotsApi.list(params).then(res => {
      setSlots(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedDirection, selectedDate]);

  const handleBook = async (slotId: string) => {
    setBookingSlot(slotId);
    try {
      await bookingsApi.create({ slot_id: slotId });
      // Refresh slots
      const params: any = { slot_date: selectedDate };
      if (selectedDirection) params.direction_id = selectedDirection;
      const res = await slotsApi.list(params);
      setSlots(res.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка бронирования');
    } finally {
      setBookingSlot(null);
    }
  };

  const statusColor = (s: Slot) => {
    if (s.status === 'available' && s.current_count === 0) return 'border-l-success';
    if (s.status === 'available') return 'border-l-accent';
    if (s.status === 'full') return 'border-l-error';
    return 'border-l-text-muted';
  };

  const statusLabel = (s: Slot) => {
    if (s.status === 'available') return `${s.current_count}/${s.capacity}`;
    if (s.status === 'full') return 'Занят';
    if (s.status === 'completed') return 'Завершён';
    if (s.status === 'cancelled') return 'Отменён';
    return s.status;
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Расписание</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field w-auto"
        />
        <select
          value={selectedDirection}
          onChange={(e) => setSelectedDirection(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Все направления</option>
          {directions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Slots */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">На выбранную дату слотов нет</p>
          <p className="text-sm mt-2">Попробуйте другую дату или направление</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map(slot => (
            <Card
              key={slot.id}
              hover={false}
              className={`border-l-4 ${statusColor(slot)} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-lg font-bold font-accent">{slot.start_time.slice(0, 5)}</p>
                  <p className="text-xs text-text-muted">{slot.end_time.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="font-medium">{slot.duration_minutes} мин</p>
                  <div className="flex gap-2 text-xs text-text-muted">
                    <span className="badge bg-bg-elevated text-text-secondary">{slot.type === 'individual' ? 'Индивидуальный' : slot.type === 'team' ? 'Командный' : 'Открытый'}</span>
                    <span>{statusLabel(slot)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {slot.status === 'available' && user?.role !== 'guest' && (
                  <Button
                    size="sm"
                    loading={bookingSlot === slot.id}
                    onClick={() => handleBook(slot.id)}
                  >
                    Записаться
                  </Button>
                )}
                {slot.status === 'full' && (
                  <span className="text-sm text-error font-medium">Заполнен</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
