import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard, RoleGuard, GuestGuard } from '@/components/guards/AuthGuard';

// Pages
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { HomePage } from '@/pages/Home/HomePage';
import { DirectionsPage } from '@/pages/Directions/DirectionsPage';
import { SchedulePage } from '@/pages/Schedule/SchedulePage';
import { RatingPage } from '@/pages/Rating/RatingPage';

// Placeholder pages for routes that need implementation
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-text-secondary">Страница в разработке</p>
      </div>
    </div>
  );
}

export default function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Guest */}
        <Route path="/auth/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/auth/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />

        {/* All authenticated users */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/directions" element={<DirectionsPage />} />
          <Route path="/directions/:slug" element={<PlaceholderPage title="Страница направления" />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/schedule/:slotId" element={<PlaceholderPage title="Детали слота" />} />
          <Route path="/news" element={<PlaceholderPage title="Новости" />} />
          <Route path="/news/:slug" element={<PlaceholderPage title="Статья" />} />
          <Route path="/materials" element={<PlaceholderPage title="Материалы" />} />
          <Route path="/materials/:id" element={<PlaceholderPage title="Материал" />} />
          <Route path="/map" element={<PlaceholderPage title="Карта кампуса" />} />
          <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
          <Route path="/profile/bookings" element={<PlaceholderPage title="Мои бронирования" />} />
          <Route path="/profile/notifications" element={<PlaceholderPage title="Уведомления" />} />
        </Route>

        {/* Students only */}
        <Route element={<RoleGuard roles={['student', 'admin']} />}>
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/rewards" element={<PlaceholderPage title="Награды" />} />
          <Route path="/teams" element={<PlaceholderPage title="Команды" />} />
          <Route path="/profile/dksh" element={<PlaceholderPage title="Анкета ДКШ" />} />
        </Route>

        {/* Admin */}
        <Route element={<RoleGuard roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<PlaceholderPage title="Админ: Дашборд" />} />
          <Route path="/admin/users" element={<PlaceholderPage title="Админ: Пользователи" />} />
          <Route path="/admin/directions" element={<PlaceholderPage title="Админ: Направления" />} />
          <Route path="/admin/resources" element={<PlaceholderPage title="Админ: Ресурсы" />} />
          <Route path="/admin/locations" element={<PlaceholderPage title="Админ: Локации" />} />
          <Route path="/admin/slots" element={<PlaceholderPage title="Админ: Слоты" />} />
          <Route path="/admin/news" element={<PlaceholderPage title="Админ: Новости" />} />
          <Route path="/admin/materials" element={<PlaceholderPage title="Админ: Материалы" />} />
          <Route path="/admin/rewards" element={<PlaceholderPage title="Админ: Награды" />} />
          <Route path="/admin/rating" element={<PlaceholderPage title="Админ: Рейтинг" />} />
          <Route path="/admin/dksh" element={<PlaceholderPage title="Админ: Кандидаты ДКШ" />} />
          <Route path="/admin/analytics" element={<PlaceholderPage title="Админ: Аналитика" />} />
          <Route path="/admin/audit" element={<PlaceholderPage title="Админ: Журнал действий" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
