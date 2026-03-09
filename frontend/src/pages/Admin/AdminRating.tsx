import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ratingApi, usersApi } from '@/api';
import type { User } from '@/types/api';
import { ChevronLeft, Award } from 'lucide-react';

export function AdminRating() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjusting, setAdjusting] = useState<User | null>(null);
  const [form, setForm] = useState({ points: 0, reason: '', event_type: 'manual' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = search ? { search } : {};
    usersApi.list(params).then(res => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  const handleAdjust = async () => {
    if (!adjusting || !form.reason || form.points === 0) { alert('Укажите баллы и причину'); return; }
    setSaving(true);
    try {
      await ratingApi.adjust({ user_id: adjusting.id, ...form });
      setAdjusting(null);
      setForm({ points: 0, reason: '', event_type: 'manual' });
      const res = await usersApi.list(search ? { search } : {});
      setUsers(res.data);
    } catch (err: any) { alert(err.response?.data?.detail || 'Ошибка'); }
    setSaving(false);
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Управление рейтингом</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск пользователя..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      {adjusting && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">
            Корректировка: {adjusting.first_name} {adjusting.last_name} (текущий: {adjusting.rating_score})
          </h3>
          <div className="space-y-4">
            <Input label="Баллы (+ или −)" type="number" value={String(form.points)} onChange={(e) => setForm({ ...form, points: +e.target.value })} />
            <Input label="Причина *" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Причина корректировки" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Тип</label>
              <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="input-field">
                <option value="manual">Ручная корректировка</option>
                <option value="achievement">Достижение</option>
                <option value="violation">Нарушение</option>
                <option value="tournament">Турнир</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button loading={saving} onClick={handleAdjust}>Применить</Button>
              <Button variant="ghost" onClick={() => setAdjusting(null)}>Отмена</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-14" />)}</div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <Card key={u.id} hover={false} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">{u.first_name[0]}{u.last_name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{u.last_name} {u.first_name}</p>
                  <p className="text-xs text-text-muted">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-bold font-accent text-lg ${
                  u.rating_score < 30 ? 'text-error' : u.rating_score < 70 ? 'text-accent' : 'text-success'
                }`}>{u.rating_score}</span>
                <Button variant="ghost" size="sm" onClick={() => setAdjusting(u)}>
                  <Award size={14} className="mr-1" /> Корректировка
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
