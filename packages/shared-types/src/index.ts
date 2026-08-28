export type UserRole = "patient" | "caregiver" | "admin";

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth?: string | null;
  region?: string | null;
  notes?: string | null;
  caregiver_id?: string | null;
}

export interface Caregiver {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
}

export interface GameSession {
  id: string;
  patient_id: string;
  game_type: string;
  score?: number | null;
  duration_seconds?: number | null;
  played_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  message?: string | null;
  scheduled_at: string;
  is_sent: boolean;
}

export interface ProgressMetrics {
  patient_id: string;
  total_sessions: number;
  average_score: number;
  streak_days: number;
  last_active: string;
}

export interface PlatformStats {
  total_patients: number;
  total_caregivers: number;
  total_sessions: number;
  regions: Record<string, number>;
}
