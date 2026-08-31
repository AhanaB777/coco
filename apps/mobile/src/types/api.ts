export type GameType =
  | "memory_match"
  | "sequence_recall"
  | "object_recognition";

export type ReminderType =
  | "medicine"
  | "hydration"
  | "activity"
  | "appointment";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PatientLoginRequest {
  patient_id: string;
  pin: string;
}

export interface PatientAuthResponse {
  id: string;
  full_name: string;
  preferred_language: string;
  region?: string | null;
}

export interface AuthMeResponse {
  role: string;
  patient?: PatientAuthResponse | null;
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

export interface ProgressMetrics {
  patient_id: string;
  total_sessions: number;
  average_score: number;
  streak_days: number;
  last_active?: string | null;
}
