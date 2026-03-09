import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { resourcesApi, directionsApi } from '@/api';
import type { Resource, Direction } from '@/types/api';
import { ChevronLeft, Monitor } from 'lucide-react';

export function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    Promise.all([
      resourcesApi.list(),
      directionsApi.list(),
    ]).then(([rRes, dRes]) => {
      setResources(rRes.data);
      setDirections(dRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const dirName = (id: string) => directions.find(d => d.id === id)?.name || '';
  const filtered = filter ? resources.filter(r => r.direction_id === filter) : resources;

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Ресурсы</h1>

      <div className="mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
          <option value="">Все направления</option>
          {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-16" />)}</div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-text-muted mb-2">Всего: {filtered.length}</p>
          {filtered.map(r => (
            <Card key={r.id} hover={false} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${r.status === 'active' ? 'bg-success' : r.status === 'maintenance' ? 'bg-accent' : 'bg-error'}`} />
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-text-muted">{dirName(r.direction_id)} · {r.type}{r.capacity ? ` · ${r.capacity} мест` : ''}</p>
                </div>
              </div>
              <span className="badge bg-bg-elevated text-text-muted text-xs">{r.status}</span>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
