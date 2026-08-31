export type UserRole = "patient" | "caregiver" | "admin";

export type GameType =
  | "memory_match"
  | "sequence_recall"
  | "object_recognition";

export type ReminderType =
  | "medicine"
  | "hydration"
  | "activity"
  | "appointment";

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
  region?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PatientLoginRequest {
  patient_id?: string;
  full_name?: string;
  pin: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  region?: string | null;
  role: string;
}

export interface PatientAuthResponse {
  id: string;
  full_name: string;
  preferred_language: string;
  region?: string | null;
}

export interface AuthMeResponse {
  role: string;
  user?: UserResponse | null;
  patient?: PatientAuthResponse | null;
}

export interface Patient {
  id: string;
  caregiver_id: string;
  full_name: string;
  date_of_birth?: string | null;
  region?: string | null;
  notes?: string | null;
  preferred_language: string;
  photo_uri?: string | null;
  cognitive_level: number;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  full_name: string;
  date_of_birth?: string | null;
  region?: string | null;
  notes?: string | null;
  preferred_language?: string;
  photo_uri?: string | null;
  pin?: string | null;
}

export interface Caregiver {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  region?: string | null;
  role: string;
}

export interface GameSession {
  id: string;
  patient_id: string;
  game_type: GameType;
  score?: number | null;
  duration_seconds?: number | null;
  difficulty_level: number;
  played_at: string;
}

export interface GameSessionCreate {
  patient_id: string;
  game_type: GameType;
  score?: number | null;
  duration_seconds?: number | null;
  difficulty_level?: number | null;
}

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  message?: string | null;
  reminder_type: ReminderType;
  scheduled_at: string;
  is_done: boolean;
  completed_at?: string | null;
  is_sent: boolean;
}

export interface ReminderCreate {
  patient_id: string;
  title: string;
  message?: string | null;
  reminder_type: ReminderType;
  scheduled_at: string;
}

export interface ReminderUpdate {
  title?: string | null;
  message?: string | null;
  reminder_type?: ReminderType | null;
  scheduled_at?: string | null;
  is_done?: boolean | null;
}

export interface ProgressMetrics {
  patient_id: string;
  total_sessions: number;
  average_score: number;
  streak_days: number;
  last_active?: string | null;
}

export interface PlatformStats {
  total_patients: number;
  total_caregivers: number;
  total_sessions: number;
  regions: Record<string, number>;
}

export interface SystemHealthResponse {
  status: string;
  database: string;
  redis: string;
  detail?: string | null;
}
