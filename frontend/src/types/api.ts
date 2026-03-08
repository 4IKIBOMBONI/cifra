export interface User {
  id: string;
  email: string;
  role: 'student' | 'guest' | 'trainer' | 'admin';
  first_name: string;
  last_name: string;
  patronymic?: string;
  student_id_number?: string;
  avatar_url?: string;
  telegram?: string;
  phone?: string;
  rating_score: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Direction {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  cover_image_url?: string;
  default_slot_capacity: number;
  slot_durations: number[];
  is_active: boolean;
  sort_order: number;
}

export interface Location {
  id: string;
  name: string;
  building?: string;
  floor?: number;
  room?: string;
  description?: string;
  photo_url?: string;
  map_x?: number;
  map_y?: number;
  is_active: boolean;
}

export interface Resource {
  id: string;
  direction_id: string;
  location_id?: string;
  name: string;
  type: string;
  description?: string;
  photo_url?: string;
  status: string;
  capacity?: number;
}

export interface Slot {
  id: string;
  direction_id: string;
  resource_id?: string;
  trainer_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  type: 'individual' | 'team' | 'open';
  capacity: number;
  current_count: number;
  status: 'available' | 'full' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  slot_id: string;
  user_id: string;
  team_id?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  attended?: boolean;
  cancelled_at?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  direction_id: string;
  captain_id: string;
  created_at: string;
}

export interface RatingEvent {
  id: string;
  user_id: string;
  event_type: string;
  points: number;
  balance_after: number;
  reason: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  rating_score: number;
  rank: number;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  cost_points: number;
  stock: number;
  is_active: boolean;
}

export interface RewardRequest {
  id: string;
  user_id: string;
  reward_id: string;
  status: 'pending' | 'issued' | 'rejected';
  points_spent: number;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  type: 'news' | 'announcement' | 'result';
  direction_id?: string;
  content: string;
  cover_image_url?: string;
  event_date?: string;
  is_published: boolean;
  published_at?: string;
  author_id: string;
}

export interface Material {
  id: string;
  title: string;
  type: string;
  direction_id?: string;
  content?: string;
  file_url?: string;
  external_url?: string;
  video_url?: string;
  is_published: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
}

export interface DkshProfile {
  id: string;
  user_id: string;
  about?: string;
  skills: string[];
  interests: string[];
  achievements: string[];
  directions: string[];
  experience?: string;
  contact_telegram?: string;
  contact_vk?: string;
  contact_phone?: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
