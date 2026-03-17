import apiClient from './client';
import type {
  Booking, Direction, DkshProfile, LeaderboardEntry, Location,
  Material, NewsPost, Notification, RatingEvent, Resource, Reward,
  RewardRequest, Slot, Team, User,
} from '@/types/api';

export { authApi } from './auth';

export const directionsApi = {
  list: () => apiClient.get<Direction[]>('/directions'),
  get: (slug: string) => apiClient.get<Direction>(`/directions/${slug}`),
};

export const slotsApi = {
  list: (params?: { direction_id?: string; slot_date?: string; status?: string }) =>
    apiClient.get<Slot[]>('/slots', { params }),
  get: (id: string) => apiClient.get<Slot>(`/slots/${id}`),
  generate: (data: any) => apiClient.post<Slot[]>('/slots/generate', data),
};

export const bookingsApi = {
  create: (data: { slot_id: string; team_id?: string }) =>
    apiClient.post<Booking>('/bookings', data),
  my: (params?: { status?: string }) =>
    apiClient.get<Booking[]>('/bookings/my', { params }),
  cancel: (id: string) => apiClient.post<Booking>(`/bookings/${id}/cancel`),
  updateAttendance: (slotId: string, data: { user_id: string; attended: boolean }[]) =>
    apiClient.post(`/slots/${slotId}/attendance`, data),
};

export const teamsApi = {
  my: () => apiClient.get<Team[]>('/teams/my'),
  create: (data: { name: string; direction_id: string }) =>
    apiClient.post<Team>('/teams', data),
  invite: (teamId: string, userId: string) =>
    apiClient.post(`/teams/${teamId}/invite`, { user_id: userId }),
  accept: (teamId: string) => apiClient.post(`/teams/${teamId}/accept`),
  members: (teamId: string) => apiClient.get(`/teams/${teamId}/members`),
};

export const ratingApi = {
  myHistory: (limit?: number) =>
    apiClient.get<RatingEvent[]>('/rating/my', { params: { limit } }),
  leaderboard: (limit?: number) =>
    apiClient.get<LeaderboardEntry[]>('/rating/leaderboard', { params: { limit } }),
  adjust: (data: { user_id: string; points: number; reason: string; event_type?: string }) =>
    apiClient.post('/rating/adjust', data),
};

export const rewardsApi = {
  list: () => apiClient.get<Reward[]>('/rewards'),
  request: (rewardId: string) =>
    apiClient.post<RewardRequest>('/rewards/request', { reward_id: rewardId }),
  myRequests: () => apiClient.get<RewardRequest[]>('/rewards/requests/my'),
  issue: (requestId: string) =>
    apiClient.post(`/rewards/requests/${requestId}/issue`),
  create: (data: any) => apiClient.post<Reward>('/rewards', data),
  update: (id: string, data: any) => apiClient.patch<Reward>(`/rewards/${id}`, data),
};

export const newsApi = {
  list: (params?: { type?: string; direction_id?: string }) =>
    apiClient.get<NewsPost[]>('/news', { params }),
  get: (slug: string) => apiClient.get<NewsPost>(`/news/${slug}`),
  create: (data: any) => apiClient.post<NewsPost>('/news', data),
  update: (id: string, data: any) => apiClient.patch<NewsPost>(`/news/${id}`, data),
};

export const materialsApi = {
  list: (params?: { type?: string; direction_id?: string; search?: string }) =>
    apiClient.get<Material[]>('/materials', { params }),
  get: (id: string) => apiClient.get<Material>(`/materials/${id}`),
  create: (data: any) => apiClient.post<Material>('/materials', data),
};

export const locationsApi = {
  list: () => apiClient.get<Location[]>('/locations'),
  get: (id: string) => apiClient.get<Location>(`/locations/${id}`),
};

export const resourcesApi = {
  list: (params?: { direction_id?: string }) =>
    apiClient.get<Resource[]>('/resources', { params }),
};

export const dkshApi = {
  my: () => apiClient.get<DkshProfile | null>('/dksh/my'),
  save: (data: any) => apiClient.post<DkshProfile>('/dksh', data),
  candidates: () => apiClient.get<DkshProfile[]>('/dksh/candidates'),
};

export const notificationsApi = {
  list: (params?: { unread_only?: boolean }) =>
    apiClient.get<Notification[]>('/notifications', { params }),
  unreadCount: () => apiClient.get<{ count: number }>('/notifications/unread-count'),
  markRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post('/notifications/read-all'),
};

export const analyticsApi = {
  dashboard: () => apiClient.get('/analytics/dashboard'),
  bookings: (params?: { date_from?: string; date_to?: string }) =>
    apiClient.get('/analytics/bookings', { params }),
  directionsPopularity: () => apiClient.get('/analytics/directions-popularity'),
};

export const usersApi = {
  list: (params?: { role?: string; search?: string }) =>
    apiClient.get<User[]>('/users', { params }),
  get: (id: string) => apiClient.get<User>(`/users/${id}`),
  create: (data: any) => apiClient.post<User>('/users', data),
  update: (id: string, data: any) => apiClient.patch<User>(`/users/${id}`, data),
  updateMe: (data: any) => apiClient.patch<User>('/users/me', data),
};

export const auditApi = {
  list: (params?: { user_id?: string; action?: string; entity_type?: string }) =>
    apiClient.get('/audit', { params }),
};

export const uploadsApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ url: string; filename: string }>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
