import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { materialsApi, directionsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { Material, Direction } from '@/types/api';
import { ChevronLeft, Plus, BookOpen } from 'lucide-react';

export function AdminMaterials() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'lecture', content: '', direction_id: '', video_url: '', external_url: '', is_published: true,
  });

  useEffect(() => {
    Promise.all([materialsApi.list(), directionsApi.list()]).then(([mRes, dRes]) => {
      setMaterials(mRes.data);
      setDirections(dRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title) { alert('Заполните название'); return; }
    setCreating(true);
    try {
      const data: any = { ...form, author_id: user?.id };
      if (!data.direction_id) delete data.direction_id;
      if (!data.video_url) delete data.video_url;
      if (!data.external_url) delete data.external_url;
      await materialsApi.create(data);
      const res = await materialsApi.list();
      setMaterials(res.data);
      setShowCreate(false);
      setForm({ title: '', type: 'lecture', content: '', direction_id: '', video_url: '', external_url: '', is_published: true });
    } catch (err: any) { alert(err.response?.data?.detail || 'Ошибка'); }
    setCreating(false);
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Материалы</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} className="mr-1" /> Создать
        </Button>
      </div>

      {showCreate && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">Новый материал</h3>
          <div className="space-y-4">
            <Input label="Название *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Тип</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="lecture">Лекция</option>
                  <option value="instruction">Инструкция</option>
                  <option value="video">Видео</option>
                  <option value="link">Ссылка</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Направление</label>
                <select value={form.direction_id} onChange={(e) => setForm({ ...form, direction_id: e.target.value })} className="input-field">
                  <option value="">Общий</option>
                  {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <Input label="Ссылка на видео" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/..." />
            <Input label="Внешняя ссылка" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} placeholder="https://..." />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Содержание (HTML)</label>
              <textarea className="input-field min-h-[120px] resize-y font-mono text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button loading={creating} onClick={handleCreate}>Создать</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Отмена</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-16" />)}</div>
      ) : (
        <div className="space-y-2">
          {materials.map(mat => (
            <Card key={mat.id} hover={false} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{mat.title}</h3>
                <div className="flex gap-2 text-xs text-text-muted mt-1">
                  <span className="badge bg-bg-elevated">{mat.type}</span>
                  <span>{mat.is_published ? 'Опубликовано' : 'Черновик'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
