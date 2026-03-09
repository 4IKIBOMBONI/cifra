import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { slotsApi, directionsApi, resourcesApi } from '@/api';
import type { Slot, Direction, Resource } from '@/types/api';
import { ChevronLeft, Plus } from 'lucide-react';

export function AdminSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [showGen, setShowGen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({
    direction_id: '',
    resource_id: '',
    date_from: new Date().toISOString().split('T')[0],
    date_to: '',
    start_hour: 10,
    end_hour: 20,
    duration_minutes: 60,
    capacity: 5,
    type: 'open' as string,
    gap_minutes: 0,
  });

  useEffect(() => {
    Promise.all([
      directionsApi.list(),
      resourcesApi.list(),
    ]).then(([dRes, rRes]) => {
      setDirections(dRes.data);
      setResources(rRes.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { slot_date: selectedDate };
    if (selectedDirection) params.direction_id = selectedDirection;
    slotsApi.list(params).then(res => {
      setSlots(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedDate, selectedDirection]);

  const handleGenerate = async () => {
    if (!genForm.direction_id || !genForm.date_from || !genForm.date_to) {
      alert('Заполните обязательные поля');
      return;
    }
    setGenerating(true);
    try {
      await slotsApi.generate(genForm);
      setShowGen(false);
      // Refresh
      const params: any = { slot_date: selectedDate };
      if (selectedDirection) params.direction_id = selectedDirection;
      const res = await slotsApi.list(params);
      setSlots(res.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка генерации');
    }
    setGenerating(false);
  };

  const dirName = (id: string) => directions.find(d => d.id === id)?.name || '';

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Управление слотами</h1>
        <Button size="sm" onClick={() => setShowGen(!showGen)}>
          <Plus size={16} className="mr-1" /> Генератор
        </Button>
      </div>

      {/* Generator */}
      {showGen && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">Генератор слотов</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Направление *</label>
              <select
                value={genForm.direction_id}
                onChange={(e) => setGenForm({ ...genForm, direction_id: e.target.value })}
                className="input-field"
              >
                <option value="">Выберите</option>
                {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Ресурс</label>
              <select
                value={genForm.resource_id}
                onChange={(e) => setGenForm({ ...genForm, resource_id: e.target.value })}
                className="input-field"
              >
                <option value="">Выберите</option>
                {resources.filter(r => !genForm.direction_id || r.direction_id === genForm.direction_id).map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Тип</label>
              <select value={genForm.type} onChange={(e) => setGenForm({ ...genForm, type: e.target.value })} className="input-field">
                <option value="open">Открытый</option>
                <option value="individual">Индивидуальный</option>
                <option value="team">Командный</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">С даты *</label>
              <input type="date" value={genForm.date_from} onChange={(e) => setGenForm({ ...genForm, date_from: e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">По дату *</label>
              <input type="date" value={genForm.date_to} onChange={(e) => setGenForm({ ...genForm, date_to: e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Длительность (мин)</label>
              <input type="number" value={genForm.duration_minutes} onChange={(e) => setGenForm({ ...genForm, duration_minutes: +e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Начало (час)</label>
              <input type="number" value={genForm.start_hour} min={0} max={23} onChange={(e) => setGenForm({ ...genForm, start_hour: +e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Конец (час)</label>
              <input type="number" value={genForm.end_hour} min={0} max={23} onChange={(e) => setGenForm({ ...genForm, end_hour: +e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Вместимость</label>
              <input type="number" value={genForm.capacity} onChange={(e) => setGenForm({ ...genForm, capacity: +e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button loading={generating} onClick={handleGenerate}>Сгенерировать</Button>
            <Button variant="ghost" onClick={() => setShowGen(false)}>Отмена</Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field w-auto" />
        <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)} className="input-field w-auto">
          <option value="">Все направления</option>
          {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Slots list */}
      <p className="text-sm text-text-muted mb-3">Слотов: {slots.length}</p>
      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-14" />)}</div>
      ) : slots.length === 0 ? (
        <p className="text-center py-8 text-text-muted">Нет слотов на выбранную дату</p>
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
                  <p className="text-sm font-medium">{dirName(slot.direction_id)}</p>
                  <div className="flex gap-2 text-xs text-text-muted">
                    <span>{slot.type}</span>
                    <span>{slot.current_count}/{slot.capacity}</span>
                    <span className={slot.status === 'available' ? 'text-success' : slot.status === 'full' ? 'text-error' : ''}>{slot.status}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
