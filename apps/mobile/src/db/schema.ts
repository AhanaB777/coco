export type ReminderType = "medicine" | "hydration" | "appointment";

export type GameType =
  | "memory_match"
  | "sequence_recall"
  | "object_recognition";

export interface PatientProfile {
  id: string;
  display_name: string;
  photo_uri: string | null;
  pin: string | null;
  caregiver_id: string | null;
  created_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  reminder_type: ReminderType;
  scheduled_at: string;
  is_done: number;
  completed_at: string | null;
}

export interface GameSession {
  id: string;
  patient_id: string;
  game_type: GameType;
  score: number | null;
  duration_seconds: number | null;
  played_at: string;
}

export const CREATE_PATIENT_PROFILES_TABLE = `
  CREATE TABLE IF NOT EXISTS patient_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL,
    photo_uri TEXT,
    pin TEXT,
    caregiver_id TEXT,
    created_at TEXT NOT NULL
  );
`;

export const CREATE_REMINDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    title TEXT NOT NULL,
    reminder_type TEXT NOT NULL,
    scheduled_at TEXT NOT NULL,
    is_done INTEGER DEFAULT 0,
    completed_at TEXT
  );
`;

export const CREATE_GAME_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS game_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    game_type TEXT NOT NULL,
    score INTEGER,
    duration_seconds INTEGER,
    played_at TEXT NOT NULL
  );
`;
