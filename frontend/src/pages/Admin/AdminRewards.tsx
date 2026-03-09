import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { rewardsApi } from '@/api';
import type { Reward, RewardRequest } from '@/types/api';
import { ChevronLeft, Plus, Gift, Check } from 'lucide-react';

export function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [requests, setRequests] = useState<RewardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'rewards' | 'requests'>('rewards');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', cost_points: 100, stock: 10, is_active: true });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const rRes = await rewardsApi.list();
      setRewards(rRes.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.name) return;
    setCreating(true);
    try {
      await rewardsApi.create(form);
      await loadData();
      setShowCreate(false);
      setForm({ name: '', description: '', cost_points: 100, stock: 10, is_active: true });
    } catch (err: any) { alert(err.response?.data?.detail || 'Ошибка'); }
    setCreating(false);
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Награды</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} className="mr-1" /> Добавить
        </Button>
      </div>

      {showCreate && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">Новая награда</h3>
          <div className="space-y-4">
            <Input label="Название *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Стоимость (баллы)" type="number" value={String(form.cost_points)} onChange={(e) => setForm({ ...form, cost_points: +e.target.value })} />
              <Input label="В наличии" type="number" value={String(form.stock)} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button loading={creating} onClick={handleCreate}>Создать</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Отмена</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {rewards.map(reward => (
            <Card key={reward.id} hover={false} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Gift size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{reward.name}</h3>
                  <p className="text-xs text-text-muted">{reward.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold font-accent text-primary">{reward.cost_points} б.</p>
                <p className="text-xs text-text-muted">Остаток: {reward.stock}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
