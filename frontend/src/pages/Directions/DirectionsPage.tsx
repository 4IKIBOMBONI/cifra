import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { directionsApi } from '@/api';
import type { Direction } from '@/types/api';
import { Gamepad2, Users, Clock } from 'lucide-react';
import { Emoji } from '@/components/ui/Emoji';

export function DirectionsPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    directionsApi.list().then(res => {
      setDirections(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Направления</h1>
        <p className="text-text-muted text-sm">Выбери активность и запишись на занятие</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-56" />
          ))}
        </div>
      ) : directions.length === 0 ? (
        <EmptyState
          icon={<Gamepad2 size={28} />}
          title="Направления пока не добавлены"
          description="Следите за обновлениями!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directions.map(dir => (
            <Link key={dir.id} to={`/directions/${dir.slug}`}>
              <Card className="h-full group" padding="none">
                {dir.cover_image_url ? (
                  <img src={dir.cover_image_url} alt={dir.name} className="w-full h-40 object-cover rounded-t-lg" />
                ) : (
                  <div
                    className="w-full h-40 rounded-t-lg flex items-center justify-center text-5xl"
                    style={{ background: `linear-gradient(135deg, ${dir.color || '#2563EB'}15, ${dir.color || '#2563EB'}05)` }}
                  >
                    <Emoji>{dir.icon || '🎯'}</Emoji>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    {dir.icon && <span className="text-xl"><Emoji>{dir.icon}</Emoji></span>}
                    <h2 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {dir.name}
                    </h2>
                  </div>
                  {dir.description && (
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">{dir.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {dir.default_slot_capacity} чел
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {dir.slot_durations.map(d => `${d} мин`).join(', ')}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
