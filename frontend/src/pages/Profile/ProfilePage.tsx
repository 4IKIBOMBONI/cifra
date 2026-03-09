import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/api';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link } from 'react-router-dom';
import { Calendar, Bell, Users, Award, FileText, Shield } from 'lucide-react';

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
      await usersApi.update(user.id, form);
      await fetchUser();
      setEditing(false);
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const roleName = {
    student: 'Студент',
    admin: 'Администратор',
    trainer: 'Тренер',
    guest: 'Гость',
  }[user.role];

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Профиль</h1>

      {/* User Info */}
      <Card hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">
              {user.first_name[0]}{user.last_name[0]}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">
              {user.last_name} {user.first_name} {user.patronymic || ''}
            </h2>
            <p className="text-text-secondary">{user.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-primary/10 text-primary">{roleName}</span>
              {user.is_verified && (
                <span className="badge bg-success/10 text-success">Верифицирован</span>
              )}
              {user.student_id_number && (
                <span className="badge bg-bg-elevated text-text-secondary">
                  Студ. билет: {user.student_id_number}
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className={`text-3xl font-bold font-accent ${
              user.rating_score < 30 ? 'text-error' :
              user.rating_score < 70 ? 'text-accent' : 'text-success'
            }`}>
              {user.rating_score}
            </p>
            <p className="text-xs text-text-muted">баллов</p>
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Контактная информация</h3>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Редактировать
            </Button>
          )}
        </div>
        {editing ? (
          <div className="space-y-4">
            <Input
              label="Telegram"
              placeholder="@username"
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            />
            <Input
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <Button loading={saving} onClick={handleSave}>Сохранить</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Отмена</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Telegram:</span> {user.telegram || 'Не указан'}</p>
            <p><span className="text-text-muted">Телефон:</span> {user.phone || 'Не указан'}</p>
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/profile/bookings">
          <Card className="flex items-center gap-3">
            <Calendar size={20} className="text-primary shrink-0" />
            <span className="font-medium">Мои бронирования</span>
          </Card>
        </Link>
        <Link to="/profile/notifications">
          <Card className="flex items-center gap-3">
            <Bell size={20} className="text-secondary shrink-0" />
            <span className="font-medium">Уведомления</span>
          </Card>
        </Link>
        <Link to="/teams">
          <Card className="flex items-center gap-3">
            <Users size={20} className="text-accent shrink-0" />
            <span className="font-medium">Мои команды</span>
          </Card>
        </Link>
        <Link to="/rating">
          <Card className="flex items-center gap-3">
            <Award size={20} className="text-success shrink-0" />
            <span className="font-medium">Рейтинг</span>
          </Card>
        </Link>
        {user.role === 'student' && (
          <Link to="/profile/dksh">
            <Card className="flex items-center gap-3">
              <FileText size={20} className="text-primary shrink-0" />
              <span className="font-medium">Анкета ДКШ</span>
            </Card>
          </Link>
        )}
        {user.role === 'admin' && (
          <Link to="/admin/dashboard">
            <Card className="flex items-center gap-3">
              <Shield size={20} className="text-error shrink-0" />
              <span className="font-medium">Админ-панель</span>
            </Card>
          </Link>
        )}
      </div>
    </PageLayout>
  );
}
