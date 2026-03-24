import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard, RoleGuard, GuestGuard } from '@/components/guards/AuthGuard';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { InstallPWA } from '@/components/ui/InstallPWA';

// Auth pages
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';

// Main pages
import { HomePage } from '@/pages/Home/HomePage';
import { DirectionsPage } from '@/pages/Directions/DirectionsPage';
import { DirectionDetailPage } from '@/pages/Directions/DirectionDetailPage';
import { SchedulePage } from '@/pages/Schedule/SchedulePage';
import { RatingPage } from '@/pages/Rating/RatingPage';
import { NewsPage } from '@/pages/News/NewsPage';
import { NewsDetailPage } from '@/pages/News/NewsDetailPage';
import { MaterialsPage } from '@/pages/Materials/MaterialsPage';
import { MaterialDetailPage } from '@/pages/Materials/MaterialDetailPage';
import { MapPage } from '@/pages/Map/MapPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { BookingsPage } from '@/pages/Profile/BookingsPage';
import { NotificationsPage } from '@/pages/Notifications/NotificationsPage';

// Student pages
import { RewardsPage } from '@/pages/Rewards/RewardsPage';
import { TeamsPage } from '@/pages/Teams/TeamsPage';
import { DkshPage } from '@/pages/Dksh/DkshPage';

// Admin pages
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AdminUsers } from '@/pages/Admin/AdminUsers';
import { AdminDirections } from '@/pages/Admin/AdminDirections';
import { AdminResources } from '@/pages/Admin/AdminResources';
import { AdminLocations } from '@/pages/Admin/AdminLocations';
import { AdminSlots } from '@/pages/Admin/AdminSlots';
import { AdminNews } from '@/pages/Admin/AdminNews';
import { AdminMaterials } from '@/pages/Admin/AdminMaterials';
import { AdminRewards } from '@/pages/Admin/AdminRewards';
import { AdminRating } from '@/pages/Admin/AdminRating';
import { AdminDksh } from '@/pages/Admin/AdminDksh';
import { AdminAnalytics } from '@/pages/Admin/AdminAnalytics';
import { AdminAudit } from '@/pages/Admin/AdminAudit';

export default function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <InstallPWA />
      <Routes>
        {/* Public / Guest */}
        <Route path="/auth/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/auth/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />

        {/* All authenticated users */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/directions" element={<DirectionsPage />} />
          <Route path="/directions/:slug" element={<DirectionDetailPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/bookings" element={<BookingsPage />} />
          <Route path="/profile/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Students only */}
        <Route element={<RoleGuard roles={['student', 'admin']} />}>
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/profile/dksh" element={<DkshPage />} />
        </Route>

        {/* Admin with sidebar layout */}
        <Route element={<RoleGuard roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/directions" element={<AdminDirections />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/locations" element={<AdminLocations />} />
            <Route path="/admin/slots" element={<AdminSlots />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/materials" element={<AdminMaterials />} />
            <Route path="/admin/rewards" element={<AdminRewards />} />
            <Route path="/admin/rating" element={<AdminRating />} />
            <Route path="/admin/dksh" element={<AdminDksh />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
