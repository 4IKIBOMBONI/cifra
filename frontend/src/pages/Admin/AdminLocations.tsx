import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { locationsApi } from '@/api';
import type { Location } from '@/types/api';
import { ChevronLeft, MapPin } from 'lucide-react';

export function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationsApi.list().then(res => {
      setLocations(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Локации</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map(loc => (
            <Card key={loc.id} hover={false}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{loc.name}</h3>
                  <div className="text-xs text-text-muted space-y-0.5 mt-1">
                    {loc.building && <p>Здание: {loc.building}</p>}
                    {loc.floor && <p>Этаж: {loc.floor}</p>}
                    {loc.room && <p>Аудитория: {loc.room}</p>}
                  </div>
                  {loc.description && <p className="text-xs text-text-secondary mt-2">{loc.description}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
