import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { slotsApi, bookingsApi, directionsApi } from '@/api';
import type { Slot, Direction } from '@/types/api';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Clock, Filter } from 'lucide-react';

export function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const { user } = useAuthStore();

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

  const dirName = (id: string) => directions.find(d => d.id === id)?.name || '';

  const statusConfig = (s: Slot) => {
    if (s.status === 'available' && s.current_count === 0) return { border: 'border-l-success', badge: 'success' as const, label: `${s.current_count}/${s.capacity}` };
    if (s.status === 'available') return { border: 'border-l-warning', badge: 'warning' as const, label: `${s.current_count}/${s.capacity}` };
    if (s.status === 'full') return { border: 'border-l-error', badge: 'error' as const, label: 'Заполнен' };
    if (s.status === 'completed') return { border: 'border-l-text-muted', badge: 'neutral' as const, label: 'Завершён' };
    return { border: 'border-l-text-muted', badge: 'neutral' as const, label: s.status };
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Расписание</h1>
        <p className="text-text-muted text-sm">Выбери дату и направление для записи</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field w-auto text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted" />
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            className="input-field w-auto text-sm appearance-none pr-8"
          >
            <option value="">Все направления</option>
            {directions.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Slots */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton h-20" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          icon={<Clock size={28} />}
          title="На выбранную дату слотов нет"
          description="Попробуйте другую дату или направление"
        />
      ) : (
        <div className="space-y-2">
          {slots.map(slot => {
            const sc = statusConfig(slot);
            return (
              <Card
                key={slot.id}
                hover={false}
                className={`border-l-4 ${sc.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="text-lg font-bold font-accent">{slot.start_time.slice(0, 5)}</p>
                    <p className="text-xs text-text-muted">{slot.end_time.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{dirName(slot.direction_id) || `${slot.duration_minutes} мин`}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="neutral" size="sm">
                        {slot.type === 'individual' ? 'Индив.' : slot.type === 'team' ? 'Командный' : 'Открытый'}
                      </Badge>
                      <Badge variant={sc.badge} size="sm">{sc.label}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  {slot.status === 'available' && user?.role !== 'guest' && (
                    <Button size="sm" loading={bookingSlot === slot.id} onClick={() => handleBook(slot.id)}>
                      Записаться
                    </Button>
                  )}
                  {slot.status === 'full' && (
                    <span className="text-sm text-error font-medium">Все места заняты</span>
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
