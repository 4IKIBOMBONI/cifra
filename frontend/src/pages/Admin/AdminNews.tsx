import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { newsApi, directionsApi } from '@/api';
import type { NewsPost, Direction } from '@/types/api';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, Plus, Newspaper } from 'lucide-react';

export function AdminNews() {
  const { user } = useAuthStore();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', type: 'news', content: '', direction_id: '', is_published: true,
  });

  useEffect(() => {
    Promise.all([newsApi.list(), directionsApi.list()]).then(([nRes, dRes]) => {
      setNews(nRes.data);
      setDirections(dRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.content) { alert('Заполните название и содержание'); return; }
    setCreating(true);
    try {
      const data: any = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '-').replace(/-+/g, '-'),
        author_id: user?.id,
      };
      if (!data.direction_id) delete data.direction_id;
      await newsApi.create(data);
      const res = await newsApi.list();
      setNews(res.data);
      setShowCreate(false);
      setForm({ title: '', slug: '', type: 'news', content: '', direction_id: '', is_published: true });
    } catch (err: any) { alert(err.response?.data?.detail || 'Ошибка'); }
    setCreating(false);
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Новости</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} className="mr-1" /> Создать
        </Button>
      </div>

      {showCreate && (
        <Card hover={false} className="mb-6 border-primary/30">
          <h3 className="font-semibold mb-4">Новая публикация</h3>
          <div className="space-y-4">
            <Input label="Заголовок *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Slug (авто)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Тип</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="news">Новость</option>
                  <option value="announcement">Анонс</option>
                  <option value="result">Результат</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Направление</label>
                <select value={form.direction_id} onChange={(e) => setForm({ ...form, direction_id: e.target.value })} className="input-field">
                  <option value="">Общая</option>
                  {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Содержание (HTML) *</label>
              <textarea
                className="input-field min-h-[150px] resize-y font-mono text-sm"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="<p>Текст публикации...</p>"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-primary" />
              <span className="text-sm">Опубликовать</span>
            </label>
            <div className="flex gap-2">
              <Button loading={creating} onClick={handleCreate}>Создать</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Отмена</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-16" />)}</div>
      ) : news.length === 0 ? (
        <p className="text-center py-8 text-text-muted">Нет публикаций</p>
      ) : (
        <div className="space-y-2">
          {news.map(post => (
            <Card key={post.id} hover={false} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{post.title}</h3>
                <div className="flex gap-2 text-xs text-text-muted mt-1">
                  <span className="badge bg-bg-elevated">{post.type}</span>
                  <span>{post.is_published ? 'Опубликовано' : 'Черновик'}</span>
                  {post.published_at && <span>{new Date(post.published_at).toLocaleDateString('ru-RU')}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
