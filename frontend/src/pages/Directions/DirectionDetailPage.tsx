import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { directionsApi, slotsApi, bookingsApi, resourcesApi } from '@/api';
import type { Direction, Slot, Resource } from '@/types/api';
import { useAuthStore } from '@/store/authStore';
import { Calendar, MapPin, Clock, ArrowLeft, Users, CheckCircle, XCircle } from 'lucide-react';

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
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-32" />
          <div className="skeleton h-64" />
        </div>
      </PageLayout>
    );
  }

  if (!direction) {
    return (
      <PageLayout>
        <EmptyState title="Направление не найдено" description="Попробуйте выбрать другое направление" />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Back + Header */}
      <div className="mb-8">
        <Link to="/directions" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Все направления
        </Link>
        {direction.cover_image_url && (
          <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
            <img src={direction.cover_image_url} alt={direction.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
            style={{ backgroundColor: (direction.color || '#2563EB') + '15' }}
          >
            {direction.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{direction.name}</h1>
            {direction.description && (
              <p className="text-text-secondary mt-1">{direction.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Длительность</p>
              <p className="font-semibold">{direction.slot_durations.join(' / ')} мин</p>
            </div>
          </div>
        </Card>
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Вместимость</p>
              <p className="font-semibold">{direction.default_slot_capacity} чел</p>
            </div>
          </div>
        </Card>
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <MapPin size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Ресурсов</p>
              <p className="font-semibold">{resources.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Resources */}
      {resources.length > 0 && (
        <section className="mb-8">
          <h2 className="section-title mb-4">Оборудование и площадки</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map(r => (
              <Card key={r.id} hover={false}>
                <div className="flex items-center gap-3">
                  {r.status === 'active' ? (
                    <CheckCircle size={18} className="text-success shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-error shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.type}{r.capacity ? ` · ${r.capacity} мест` : ''}</p>
                  </div>
                  <Badge variant={r.status === 'active' ? 'success' : 'error'} className="ml-auto">
                    {r.status === 'active' ? 'Доступен' : 'Недоступен'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Today's Slots */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Слоты на сегодня</h2>
          <Link to="/schedule" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
            Полное расписание →
          </Link>
        </div>
        {slots.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="На сегодня слотов нет" description="Попробуйте посмотреть расписание на другие дни" />
        ) : (
          <div className="space-y-2">
            {slots.map(slot => (
              <Card key={slot.id} hover={false} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <p className="font-bold font-accent text-lg">{slot.start_time.slice(0, 5)}</p>
                    <p className="text-xs text-text-muted">{slot.end_time.slice(0, 5)}</p>
                  </div>
                  <div>
                    <Badge variant="neutral" size="sm">
                      {slot.type === 'individual' ? 'Индивидуальный' : slot.type === 'team' ? 'Командный' : 'Открытый'}
                    </Badge>
                    <p className="text-xs text-text-muted mt-1">{slot.current_count}/{slot.capacity} мест</p>
                  </div>
                </div>
                {slot.status === 'available' && user?.role !== 'guest' && (
                  <Button size="sm" loading={bookingSlot === slot.id} onClick={() => handleBook(slot.id)}>
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
