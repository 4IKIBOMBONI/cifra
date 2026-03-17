import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { dkshApi, directionsApi } from '@/api';
import type { DkshProfile, Direction } from '@/types/api';
import { FileText, Plus, X } from 'lucide-react';

export function DkshPage() {
  const [profile, setProfile] = useState<DkshProfile | null>(null);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    about: '',
    skills: [] as string[],
    interests: [] as string[],
    achievements: [] as string[],
    directions: [] as string[],
    experience: '',
    contact_telegram: '',
    contact_vk: '',
    contact_phone: '',
    is_active: true,
  });
  const [newItem, setNewItem] = useState({ skills: '', interests: '', achievements: '' });

  useEffect(() => {
    Promise.all([
      dkshApi.my(),
      directionsApi.list(),
    ]).then(([pRes, dRes]) => {
      if (pRes.data) {
        setProfile(pRes.data);
        setForm({
          about: pRes.data.about || '',
          skills: pRes.data.skills || [],
          interests: pRes.data.interests || [],
          achievements: pRes.data.achievements || [],
          directions: pRes.data.directions || [],
          experience: pRes.data.experience || '',
          contact_telegram: pRes.data.contact_telegram || '',
          contact_vk: pRes.data.contact_vk || '',
          contact_phone: pRes.data.contact_phone || '',
          is_active: pRes.data.is_active,
        });
      }
      setDirections(dRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await dkshApi.save(form);
      setProfile(res.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка сохранения');
    }
    setSaving(false);
  };

  const addItem = (field: 'skills' | 'interests' | 'achievements') => {
    const val = newItem[field].trim();
    if (!val) return;
    setForm({ ...form, [field]: [...form[field], val] });
    setNewItem({ ...newItem, [field]: '' });
  };

  const removeItem = (field: 'skills' | 'interests' | 'achievements', index: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const toggleDirection = (id: string) => {
    setForm({
      ...form,
      directions: form.directions.includes(id)
        ? form.directions.filter(d => d !== id)
        : [...form.directions, id],
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="h-64 bg-bg-surface rounded-lg animate-pulse" />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2">Анкета кандидата ДКШ</h1>
      <p className="text-text-secondary mb-6">
        Заполните анкету для участия в программе Добровольной Кибершколы
      </p>

      <div className="space-y-6">
        {/* About */}
        <Card hover={false}>
          <h3 className="font-semibold mb-3">О себе</h3>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Расскажите о себе..."
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />
        </Card>

        {/* Skills, Interests, Achievements */}
        {(['skills', 'interests', 'achievements'] as const).map(field => {
          const labels: Record<string, string> = {
            skills: 'Навыки',
            interests: 'Интересы',
            achievements: 'Достижения',
          };
          return (
            <Card key={field} hover={false}>
              <h3 className="font-semibold mb-3">{labels[field]}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {form[field].map((item, i) => (
                  <span key={i} className="badge bg-primary/10 text-primary flex items-center gap-1">
                    {item}
                    <button onClick={() => removeItem(field, i)} className="hover:text-error">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder={`Добавить ${labels[field].toLowerCase()}...`}
                  value={newItem[field]}
                  onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addItem(field)}
                />
                <Button size="sm" variant="secondary" onClick={() => addItem(field)}>
                  <Plus size={14} />
                </Button>
              </div>
            </Card>
          );
        })}

        {/* Directions */}
        <Card hover={false}>
          <h3 className="font-semibold mb-3">Направления</h3>
          <div className="flex flex-wrap gap-2">
            {directions.map(d => (
              <button
                key={d.id}
                onClick={() => toggleDirection(d.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  form.directions.includes(d.id)
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-bg-elevated border-border text-text-secondary hover:text-white'
                }`}
              >
                {d.icon} {d.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Experience */}
        <Card hover={false}>
          <h3 className="font-semibold mb-3">Опыт</h3>
          <textarea
            className="input-field min-h-[80px] resize-y"
            placeholder="Опишите ваш опыт..."
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </Card>

        {/* Contacts */}
        <Card hover={false}>
          <h3 className="font-semibold mb-3">Контакты</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Telegram"
              placeholder="@username"
              value={form.contact_telegram}
              onChange={(e) => setForm({ ...form, contact_telegram: e.target.value })}
            />
            <Input
              label="VK"
              placeholder="vk.com/id"
              value={form.contact_vk}
              onChange={(e) => setForm({ ...form, contact_vk: e.target.value })}
            />
            <Input
              label="Телефон"
              placeholder="+7..."
              value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            />
          </div>
        </Card>

        {/* Active toggle */}
        <Card hover={false}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-border accent-primary"
            />
            <div>
              <p className="font-medium">Анкета активна</p>
              <p className="text-sm text-text-muted">Видна в списке кандидатов</p>
            </div>
          </label>
        </Card>

        <Button loading={saving} onClick={handleSave} size="lg" className="w-full">
          {profile ? 'Обновить анкету' : 'Отправить анкету'}
        </Button>
      </div>
    </PageLayout>
  );
}
