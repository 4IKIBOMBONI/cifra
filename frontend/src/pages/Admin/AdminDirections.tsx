import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { directionsApi } from '@/api';
import type { Direction } from '@/types/api';
import { ChevronLeft } from 'lucide-react';

export function AdminDirections() {
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
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Направления</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {directions.map(dir => (
            <Card key={dir.id} hover={false} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: (dir.color || '#6C5CE7') + '20' }}
                >
                  {dir.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{dir.name}</h3>
                  <p className="text-xs text-text-muted">
                    /{dir.slug} · Вместимость: {dir.default_slot_capacity} · Слоты: {dir.slot_durations.join('/')} мин
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge text-xs ${dir.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {dir.is_active ? 'Активно' : 'Неактивно'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
