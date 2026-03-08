import apiClient from './client';
import type { TokenResponse, User } from '@/types/api';

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    patronymic?: string;
    student_id_number: string;
  }) => apiClient.post<TokenResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<TokenResponse>('/auth/login', data),

  getMe: () => apiClient.get<User>('/users/me'),

  refresh: (refresh_token: string) =>
    apiClient.post<TokenResponse>('/auth/refresh', { refresh_token }),
};
