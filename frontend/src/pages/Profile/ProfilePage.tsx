import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/api';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { Calendar, Bell, Users, Award, FileText, Shield, Edit3, TrendingUp } from 'lucide-react';

export function ProfilePage() {
  const { user, fetchUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    telegram: user?.telegram || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await usersApi.updateMe(form);
      await fetchUser();
      setEditing(false);
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const roleName: Record<string, string> = { student: 'Студент', admin: 'Администратор', trainer: 'Тренер', guest: 'Гость' };
  const ratingLevel =
    user.rating_score >= 100 ? { color: 'text-primary', label: 'Элита' } :
    user.rating_score >= 70 ? { color: 'text-success', label: 'Продвинутый' } :
    user.rating_score >= 30 ? { color: 'text-accent', label: 'Активный' } :
    { color: 'text-error', label: 'Новичок' };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Профиль</h1>
        <p className="text-text-muted text-sm">Управление аккаунтом и контактами</p>
      </div>

      {/* User Info */}
      <Card hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-glow-sm" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow-sm">
              <span className="text-2xl font-bold text-white">{user.first_name[0]}{user.last_name[0]}</span>
            </div>
          )}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{user.last_name} {user.first_name} {user.patronymic || ''}</h2>
            <p className="text-text-secondary text-sm">{user.email}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{roleName[user.role] || user.role}</Badge>
              {user.is_verified && <Badge variant="success">Верифицирован</Badge>}
              {user.student_id_number && <Badge variant="neutral">Студ. билет: {user.student_id_number}</Badge>}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-bg-elevated">
            <p className={`text-3xl font-bold font-accent ${ratingLevel.color}`}>{user.rating_score}</p>
            <p className="text-xs text-text-muted mt-0.5">{ratingLevel.label}</p>
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">Контактная информация</h3>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)} icon={<Edit3 size={14} />}>
              Редактировать
            </Button>
          )}
        </div>
        {editing ? (
          <div className="space-y-4">
            <Input label="Telegram" placeholder="@username" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} />
            <Input label="Телефон" placeholder="+7 (999) 123-45-67" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="flex gap-2">
              <Button loading={saving} onClick={handleSave}>Сохранить</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Отмена</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-bg-elevated">
              <p className="text-text-muted text-xs mb-0.5">Telegram</p>
              <p className="font-medium">{user.telegram || 'Не указан'}</p>
            </div>
            <div className="p-3 rounded-lg bg-bg-elevated">
              <p className="text-text-muted text-xs mb-0.5">Телефон</p>
              <p className="font-medium">{user.phone || 'Не указан'}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <h3 className="text-base font-bold mb-3">Быстрый доступ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { to: '/profile/bookings', icon: <Calendar size={20} />, color: 'primary', title: 'Мои бронирования' },
          { to: '/profile/notifications', icon: <Bell size={20} />, color: 'secondary', title: 'Уведомления' },
          { to: '/teams', icon: <Users size={20} />, color: 'accent', title: 'Мои команды' },
          { to: '/rating', icon: <TrendingUp size={20} />, color: 'success', title: 'Рейтинг' },
          ...(user.role === 'student' ? [{ to: '/profile/dksh', icon: <FileText size={20} />, color: 'primary', title: 'Анкета ДКШ' }] : []),
          ...(user.role === 'admin' ? [{ to: '/profile/dksh', icon: <FileText size={20} />, color: 'primary', title: 'Анкета ДКШ' }] : []),
          ...(user.role === 'admin' ? [{ to: '/admin/dashboard', icon: <Shield size={20} />, color: 'error', title: 'Админ-панель' }] : []),
        ].map(link => (
          <Link key={link.to} to={link.to}>
            <Card className="flex items-center gap-3 group">
              <div className={`w-10 h-10 rounded-xl bg-${link.color}/10 flex items-center justify-center text-${link.color} group-hover:scale-110 transition-transform shrink-0`}>
                {link.icon}
              </div>
              <span className="font-medium text-sm">{link.title}</span>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
