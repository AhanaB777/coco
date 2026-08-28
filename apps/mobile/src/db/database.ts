import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

import {
  CREATE_GAME_SESSIONS_TABLE,
  CREATE_PATIENT_PROFILES_TABLE,
  CREATE_REMINDERS_TABLE,
  type PatientProfile,
  type Reminder,
} from "@/db/schema";

const DB_NAME = "coco.db";

let database: SQLiteDatabase | null = null;

export function getDatabase(): SQLiteDatabase {
  if (!database) {
    database = openDatabaseSync(DB_NAME);
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();

  db.execSync(CREATE_PATIENT_PROFILES_TABLE);
  db.execSync(CREATE_REMINDERS_TABLE);
  db.execSync(CREATE_GAME_SESSIONS_TABLE);

  seedDemoData(db);
}

function seedDemoData(db: SQLiteDatabase): void {
  const profileCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM patient_profiles"
  );

  if ((profileCount?.count ?? 0) > 0) {
    return;
  }

  const now = new Date().toISOString();
  const today = new Date();
  today.setHours(9, 0, 0, 0);

  const profiles: PatientProfile[] = [
    {
      id: "patient-1",
      display_name: "Lakshmi Devi",
      photo_uri: null,
      pin: "1234",
      caregiver_id: "caregiver-1",
      created_at: now,
    },
    {
      id: "patient-2",
      display_name: "Rajen Das",
      photo_uri: null,
      pin: "5678",
      caregiver_id: "caregiver-1",
      created_at: now,
    },
    {
      id: "patient-3",
      display_name: "Anjali Sharma",
      photo_uri: null,
      pin: "0000",
      caregiver_id: "caregiver-2",
      created_at: now,
    },
  ];

  for (const profile of profiles) {
    db.runSync(
      `INSERT INTO patient_profiles (id, display_name, photo_uri, pin, caregiver_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      profile.id,
      profile.display_name,
      profile.photo_uri,
      profile.pin,
      profile.caregiver_id,
      profile.created_at
    );
  }

  const reminders: Reminder[] = [
    {
      id: "reminder-1",
      patient_id: "patient-1",
      title: "Morning medicine",
      reminder_type: "medicine",
      scheduled_at: new Date(today.getTime()).toISOString(),
      is_done: 0,
      completed_at: null,
    },
    {
      id: "reminder-2",
      patient_id: "patient-1",
      title: "Drink a glass of water",
      reminder_type: "hydration",
      scheduled_at: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      is_done: 0,
      completed_at: null,
    },
    {
      id: "reminder-3",
      patient_id: "patient-1",
      title: "Doctor visit at clinic",
      reminder_type: "appointment",
      scheduled_at: new Date(today.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      is_done: 0,
      completed_at: null,
    },
  ];

  for (const reminder of reminders) {
    db.runSync(
      `INSERT INTO reminders (id, patient_id, title, reminder_type, scheduled_at, is_done, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      reminder.id,
      reminder.patient_id,
      reminder.title,
      reminder.reminder_type,
      reminder.scheduled_at,
      reminder.is_done,
      reminder.completed_at
    );
  }
}

export function getAllProfiles(): PatientProfile[] {
  const db = getDatabase();
  return db.getAllSync<PatientProfile>(
    "SELECT * FROM patient_profiles ORDER BY display_name ASC"
  );
}

export function getProfileById(id: string): PatientProfile | null {
  const db = getDatabase();
  return (
    db.getFirstSync<PatientProfile>(
      "SELECT * FROM patient_profiles WHERE id = ?",
      id
    ) ?? null
  );
}

export function getTodayReminders(patientId: string): Reminder[] {
  const db = getDatabase();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return db.getAllSync<Reminder>(
    `SELECT * FROM reminders
     WHERE patient_id = ?
       AND scheduled_at >= ?
       AND scheduled_at <= ?
     ORDER BY scheduled_at ASC`,
    patientId,
    start.toISOString(),
    end.toISOString()
  );
}

// TODO: [reminders teammate] implement full CRUD and sync with backend
export function markReminderDone(id: string, isDone: boolean): void {
  const db = getDatabase();
  db.runSync(
    `UPDATE reminders
     SET is_done = ?, completed_at = ?
     WHERE id = ?`,
    isDone ? 1 : 0,
    isDone ? new Date().toISOString() : null,
    id
  );
}

// TODO: [games teammate] implement game session persistence and sync
export function saveGameSessionStub(
  patientId: string,
  gameType: string,
  score: number
): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO game_sessions (id, patient_id, game_type, score, duration_seconds, played_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    `session-${Date.now()}`,
    patientId,
    gameType,
    score,
    null,
    new Date().toISOString()
  );
}

export function getTodayGameSessionCount(patientId: string): number {
  const db = getDatabase();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const result = db.getFirstSync<{ count: number }>(
    `SELECT COUNT(*) as count FROM game_sessions
     WHERE patient_id = ?
       AND played_at >= ?
       AND played_at <= ?`,
    patientId,
    start.toISOString(),
    end.toISOString()
  );

  return result?.count ?? 0;
}
