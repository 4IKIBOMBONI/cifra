import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usersApi } from '@/api';
import type { User } from '@/types/api';
import { Search, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ role: '', is_active: true, rating_score: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [roleFilter, search]);

  const loadUsers = () => {
    setLoading(true);
    const params: any = {};
    if (roleFilter) params.role = roleFilter;
    if (search) params.search = search;
    usersApi.list(params).then(res => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ role: user.role, is_active: user.is_active, rating_score: user.rating_score });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await usersApi.update(editingUser.id, editForm);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка');
    }
    setSaving(false);
  };

  const roleBadge = (role: string) => {
    const m: Record<string, string> = {
      admin: 'bg-error/10 text-error',
      trainer: 'bg-accent/10 text-accent',
      student: 'bg-primary/10 text-primary',
      guest: 'bg-bg-elevated text-text-muted',
    };
    const labels: Record<string, string> = {
      admin: 'Админ', trainer: 'Тренер', student: 'Студент', guest: 'Гость',
    };
    return <span className={`badge text-xs ${m[role] || ''}`}>{labels[role] || role}</span>;
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Пользователи</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto">
          <option value="">Все роли</option>
          <option value="student">Студенты</option>
          <option value="trainer">Тренеры</option>
          <option value="admin">Администраторы</option>
          <option value="guest">Гости</option>
        </select>
      </div>

      {/* Edit modal */}
      {editingUser && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">Редактирование: {editingUser.first_name} {editingUser.last_name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Роль</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="input-field"
              >
                <option value="student">Студент</option>
                <option value="trainer">Тренер</option>
                <option value="admin">Администратор</option>
                <option value="guest">Гость</option>
              </select>
            </div>
            <Input
              label="Рейтинг"
              type="number"
              value={String(editForm.rating_score)}
              onChange={(e) => setEditForm({ ...editForm, rating_score: Number(e.target.value) })}
            />
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Активен</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button loading={saving} onClick={handleSave}>Сохранить</Button>
            <Button variant="ghost" onClick={() => setEditingUser(null)}>Отмена</Button>
          </div>
        </Card>
      )}

      {/* Users table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-14" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-text-muted mb-2">Всего: {users.length}</div>
          {users.map(u => (
            <Card
              key={u.id}
              hover={false}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
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
                {roleBadge(u.role)}
                <span className="text-sm font-accent font-bold">{u.rating_score}</span>
                {!u.is_active && <span className="badge bg-error/10 text-error text-xs">Неактивен</span>}
                <Button variant="ghost" size="sm" onClick={() => handleEdit(u)}>
                  Изменить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
