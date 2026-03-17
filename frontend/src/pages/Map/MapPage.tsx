import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { locationsApi } from '@/api';
import type { Location } from '@/types/api';
import { MapPin, Building, Layers } from 'lucide-react';

export function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationsApi.list().then(res => { setLocations(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Карта кампуса</h1>
        <p className="text-text-muted text-sm">Нажми на маркер или площадку для подробностей</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card hover={false} padding="none" className="relative h-[500px] overflow-hidden">
            <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#111827" />
                  <stop offset="100%" stopColor="#0B1120" />
                </linearGradient>
              </defs>
              <rect width="800" height="500" fill="url(#mapBg)" rx="8" />

              {/* Grid */}
              {Array.from({ length: 16 }, (_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="#1E293B" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 10 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#1E293B" strokeWidth="0.5" />
              ))}

              {/* Buildings */}
              <rect x="100" y="80" width="180" height="120" rx="8" fill="#1F2937" stroke="#334155" strokeWidth="1" />
              <text x="190" y="145" fill="#64748B" textAnchor="middle" fontSize="12" fontFamily="Inter">Корпус 1</text>

              <rect x="350" y="200" width="160" height="100" rx="8" fill="#1F2937" stroke="#334155" strokeWidth="1" />
              <text x="430" y="255" fill="#64748B" textAnchor="middle" fontSize="12" fontFamily="Inter">Корпус 2</text>

              <rect x="550" y="280" width="180" height="120" rx="8" fill="#1F2937" stroke="#334155" strokeWidth="1" />
              <text x="640" y="345" fill="#64748B" textAnchor="middle" fontSize="12" fontFamily="Inter">Корпус 3</text>

              <rect x="600" y="60" width="140" height="80" rx="8" fill="#0B1120" stroke="#10B981" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
              <text x="670" y="105" fill="#10B981" textAnchor="middle" fontSize="11" fontFamily="Inter" opacity="0.6">Площадка</text>

              {/* Roads */}
              <path d="M 0 250 L 800 250" stroke="#1E293B" strokeWidth="3" strokeDasharray="8 4" />
              <path d="M 300 0 L 300 500" stroke="#1E293B" strokeWidth="3" strokeDasharray="8 4" />

              {/* Location markers */}
              {locations.map((loc, i) => {
                const x = (loc.map_x ?? 0.5) * 750 + 25;
                const y = (loc.map_y ?? 0.5) * 450 + 25;
                const isSelected = selected?.id === loc.id;
                return (
                  <g key={loc.id} onClick={() => setSelected(loc)} className="cursor-pointer">
                    {isSelected && (
                      <circle cx={x} cy={y} r="20" fill="none" stroke="#2563EB" strokeWidth="2" opacity="0.5">
                        <animate attributeName="r" from="15" to="28" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={x} cy={y} r="14" fill={isSelected ? '#2563EB' : '#1D4ED8'} stroke="#F1F5F9" strokeWidth="2" />
                    <text x={x} y={y + 4} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Inter">
                      {i + 1}
                    </text>
                    <text x={x} y={y - 20} fill="#94A3B8" textAnchor="middle" fontSize="10" fontFamily="Inter">
                      {loc.name.length > 25 ? loc.name.slice(0, 22) + '...' : loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Card>
        </div>

        {/* Locations list */}
        <div className="space-y-3">
          <h2 className="section-title mb-3">Площадки</h2>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="skeleton h-20" />)
          ) : locations.length === 0 ? (
            <EmptyState icon={<MapPin size={24} />} title="Нет площадок" />
          ) : (
            locations.map((loc, i) => (
              <Card
                key={loc.id}
                className={selected?.id === loc.id ? 'border-primary/40 bg-primary/5' : ''}
                onClick={() => setSelected(loc)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                    selected?.id === loc.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{loc.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                      {loc.building && <span className="flex items-center gap-1"><Building size={12} />{loc.building}</span>}
                      {loc.floor && <span className="flex items-center gap-1"><Layers size={12} />{loc.floor} этаж</span>}
                      {loc.room && <span>Ауд. {loc.room}</span>}
                    </div>
                    {loc.description && <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">{loc.description}</p>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
