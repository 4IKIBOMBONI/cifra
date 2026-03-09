import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { locationsApi } from '@/api';
import type { Location } from '@/types/api';
import { MapPin, Building, Layers } from 'lucide-react';

export function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationsApi.list().then(res => {
      setLocations(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Карта кампуса</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="lg:col-span-2">
          <Card hover={false} className="relative h-[500px] overflow-hidden">
            {/* SVG Campus Map */}
            <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="800" height="500" fill="#1a1a2e" rx="8" />

              {/* Grid */}
              {Array.from({ length: 16 }, (_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="#ffffff08" />
              ))}
              {Array.from({ length: 10 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#ffffff08" />
              ))}

              {/* Buildings */}
              <rect x="100" y="80" width="180" height="120" rx="8" fill="#2d2d44" stroke="#4a4a6a" strokeWidth="1" />
              <text x="190" y="145" fill="#888" textAnchor="middle" fontSize="12">Корпус 1</text>

              <rect x="350" y="200" width="160" height="100" rx="8" fill="#2d2d44" stroke="#4a4a6a" strokeWidth="1" />
              <text x="430" y="255" fill="#888" textAnchor="middle" fontSize="12">Корпус 2</text>

              <rect x="550" y="280" width="180" height="120" rx="8" fill="#2d2d44" stroke="#4a4a6a" strokeWidth="1" />
              <text x="640" y="345" fill="#888" textAnchor="middle" fontSize="12">Корпус 3</text>

              <rect x="600" y="60" width="140" height="80" rx="8" fill="#1d3a1d" stroke="#2a5a2a" strokeWidth="1" strokeDasharray="4" />
              <text x="670" y="105" fill="#4a8a4a" textAnchor="middle" fontSize="11">Двор / Площадка</text>

              {/* Roads */}
              <path d="M 0 250 L 800 250" stroke="#3a3a5a" strokeWidth="3" strokeDasharray="8 4" />
              <path d="M 300 0 L 300 500" stroke="#3a3a5a" strokeWidth="3" strokeDasharray="8 4" />

              {/* Location markers */}
              {locations.map((loc, i) => {
                const x = (loc.map_x ?? 0.5) * 750 + 25;
                const y = (loc.map_y ?? 0.5) * 450 + 25;
                const isSelected = selected?.id === loc.id;

                return (
                  <g
                    key={loc.id}
                    onClick={() => setSelected(loc)}
                    className="cursor-pointer"
                  >
                    {/* Pulse ring for selected */}
                    {isSelected && (
                      <circle cx={x} cy={y} r="20" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.5">
                        <animate attributeName="r" from="15" to="25" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Pin */}
                    <circle cx={x} cy={y} r="12" fill={isSelected ? '#7c3aed' : '#6C5CE7'} stroke="#fff" strokeWidth="2" />
                    <text x={x} y={y + 4} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">
                      {i + 1}
                    </text>
                    {/* Label */}
                    <text x={x} y={y - 18} fill="#ccc" textAnchor="middle" fontSize="10">
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
          <h2 className="text-lg font-semibold mb-2">Площадки</h2>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />
            ))
          ) : locations.length === 0 ? (
            <p className="text-text-muted text-sm">Локации не найдены</p>
          ) : (
            locations.map((loc, i) => (
              <Card
                key={loc.id}
                className={`${selected?.id === loc.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelected(loc)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{loc.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                      {loc.building && (
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          {loc.building}
                        </span>
                      )}
                      {loc.floor && (
                        <span className="flex items-center gap-1">
                          <Layers size={12} />
                          {loc.floor} этаж
                        </span>
                      )}
                      {loc.room && (
                        <span>Ауд. {loc.room}</span>
                      )}
                    </div>
                    {loc.description && (
                      <p className="text-xs text-text-secondary mt-1">{loc.description}</p>
                    )}
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
