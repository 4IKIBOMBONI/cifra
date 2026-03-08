import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { directionsApi } from '@/api';
import type { Direction } from '@/types/api';

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
      <h1 className="text-2xl font-bold mb-6">Направления</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : directions.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">Направления пока не добавлены</p>
          <p className="text-sm mt-2">Следите за обновлениями!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directions.map(dir => (
            <Link key={dir.id} to={`/directions/${dir.slug}`}>
              <Card className="h-full">
                {dir.cover_image_url && (
                  <img src={dir.cover_image_url} alt={dir.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-center gap-3 mb-2">
                  {dir.icon && <span className="text-2xl">{dir.icon}</span>}
                  <h2 className="text-lg font-bold" style={{ color: dir.color || undefined }}>
                    {dir.name}
                  </h2>
                </div>
                {dir.description && (
                  <p className="text-sm text-text-secondary line-clamp-3">{dir.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                  <span>Вместимость: {dir.default_slot_capacity}</span>
                  <span>Слоты: {dir.slot_durations.map(d => `${d} мин`).join(', ')}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
