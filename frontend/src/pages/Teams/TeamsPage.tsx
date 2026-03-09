import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { teamsApi, directionsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { Team, Direction } from '@/types/api';
import { Users, Plus, Crown } from 'lucide-react';

export function TeamsPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', direction_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, dRes] = await Promise.all([
        teamsApi.my(),
        directionsApi.list(),
      ]);
      setTeams(tRes.data);
      setDirections(dRes.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.name || !form.direction_id) return;
    setCreating(true);
    try {
      await teamsApi.create(form);
      setShowCreate(false);
      setForm({ name: '', direction_id: '' });
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка создания команды');
    }
    setCreating(false);
  };

  const directionName = (id: string) => directions.find(d => d.id === id)?.name || '';

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Мои команды</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} className="mr-1" />
          Создать
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card hover={false} className="mb-6">
          <h3 className="font-semibold mb-4">Новая команда</h3>
          <div className="space-y-4">
            <Input
              label="Название команды"
              placeholder="Например: Dream Team"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Направление</label>
              <select
                value={form.direction_id}
                onChange={(e) => setForm({ ...form, direction_id: e.target.value })}
                className="input-field"
              >
                <option value="">Выберите направление</option>
                {directions.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button loading={creating} onClick={handleCreate}>Создать</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Отмена</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">У вас пока нет команд</p>
          <p className="text-sm mt-2">Создайте команду или примите приглашение</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map(team => (
            <Card key={team.id} hover={false} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users size={24} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{team.name}</h3>
                    {team.captain_id === user?.id && (
                      <Crown size={14} className="text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-text-muted">{directionName(team.direction_id)}</p>
                </div>
              </div>
              <span className="text-xs text-text-muted">
                {new Date(team.created_at).toLocaleDateString('ru-RU')}
              </span>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
