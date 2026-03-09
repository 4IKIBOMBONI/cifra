import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { directionsApi, slotsApi, bookingsApi, resourcesApi } from '@/api';
import type { Direction, Slot, Resource } from '@/types/api';
import { useAuthStore } from '@/store/authStore';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function DirectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const [direction, setDirection] = useState<Direction | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    directionsApi.get(slug).then(async (res) => {
      setDirection(res.data);
      const today = new Date().toISOString().split('T')[0];
      const [slotsRes, resRes] = await Promise.all([
        slotsApi.list({ direction_id: res.data.id, slot_date: today }),
        resourcesApi.list({ direction_id: res.data.id }),
      ]);
      setSlots(slotsRes.data);
      setResources(resRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleBook = async (slotId: string) => {
    setBookingSlot(slotId);
    try {
      await bookingsApi.create({ slot_id: slotId });
      if (direction) {
        const today = new Date().toISOString().split('T')[0];
        const res = await slotsApi.list({ direction_id: direction.id, slot_date: today });
        setSlots(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка бронирования');
    }
    setBookingSlot(null);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-bg-surface rounded animate-pulse" />
          <div className="h-32 bg-bg-surface rounded-lg animate-pulse" />
          <div className="h-64 bg-bg-surface rounded-lg animate-pulse" />
        </div>
      </PageLayout>
    );
  }

  if (!direction) {
    return (
      <PageLayout>
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">Направление не найдено</p>
          <Link to="/directions" className="text-primary mt-2 inline-block">Все направления</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <Link to="/directions" className="text-sm text-text-muted hover:text-primary mb-2 inline-block">
          ← Все направления
        </Link>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: (direction.color || '#6C5CE7') + '20' }}
          >
            {direction.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{direction.name}</h1>
            <p className="text-text-secondary">{direction.description}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card hover={false} className="text-center">
          <Clock size={20} className="mx-auto mb-2 text-primary" />
          <p className="text-sm text-text-muted">Длительность</p>
          <p className="font-semibold">{direction.slot_durations.join(' / ')} мин</p>
        </Card>
        <Card hover={false} className="text-center">
          <Calendar size={20} className="mx-auto mb-2 text-secondary" />
          <p className="text-sm text-text-muted">Вместимость</p>
          <p className="font-semibold">{direction.default_slot_capacity} чел</p>
        </Card>
        <Card hover={false} className="text-center">
          <MapPin size={20} className="mx-auto mb-2 text-accent" />
          <p className="text-sm text-text-muted">Ресурсов</p>
          <p className="font-semibold">{resources.length}</p>
        </Card>
      </div>

      {/* Resources */}
      {resources.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Оборудование и площадки</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map(r => (
              <Card key={r.id} hover={false} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shrink-0 ${r.status === 'active' ? 'bg-success' : 'bg-error'}`} />
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.type}{r.capacity ? ` · ${r.capacity} мест` : ''}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Today's Slots */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Слоты на сегодня</h2>
          <Link to="/schedule" className="text-sm text-primary hover:text-primary-light">
            Полное расписание →
          </Link>
        </div>
        {slots.length === 0 ? (
          <p className="text-text-muted text-center py-8">На сегодня слотов нет</p>
        ) : (
          <div className="space-y-2">
            {slots.map(slot => (
              <Card key={slot.id} hover={false} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <p className="font-bold font-accent">{slot.start_time.slice(0, 5)}</p>
                    <p className="text-xs text-text-muted">{slot.end_time.slice(0, 5)}</p>
                  </div>
                  <div>
                    <span className="badge bg-bg-elevated text-text-secondary text-xs">
                      {slot.type === 'individual' ? 'Индивидуальный' : slot.type === 'team' ? 'Командный' : 'Открытый'}
                    </span>
                    <p className="text-xs text-text-muted mt-1">{slot.current_count}/{slot.capacity} мест</p>
                  </div>
                </div>
                {slot.status === 'available' && user?.role !== 'guest' && (
                  <Button
                    size="sm"
                    loading={bookingSlot === slot.id}
                    onClick={() => handleBook(slot.id)}
                  >
                    Записаться
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
