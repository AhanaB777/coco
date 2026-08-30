import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

import {
  CREATE_GAME_SESSIONS_TABLE,
  CREATE_PATIENT_PROFILES_TABLE,
  CREATE_REMINDERS_TABLE,
  type PatientProfile,
  type Reminder,
} from "@/db/schema";

const DB_NAME = "coco.db";

// Async API only: the sync API (openDatabaseSync/execSync/...) requires
// SharedArrayBuffer on web, which needs cross-origin isolation headers that
// the Expo dev server does not serve.
let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DB_NAME);
  }
  return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(CREATE_PATIENT_PROFILES_TABLE);
  await db.execAsync(CREATE_REMINDERS_TABLE);
  await db.execAsync(CREATE_GAME_SESSIONS_TABLE);

  await seedDemoData(db);
}

async function seedDemoData(db: SQLiteDatabase): Promise<void> {
  const profileCount = await db.getFirstAsync<{ count: number }>(
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
    await db.runAsync(
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
    await db.runAsync(
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

export async function getAllProfiles(): Promise<PatientProfile[]> {
  const db = await getDatabase();
  return db.getAllAsync<PatientProfile>(
    "SELECT * FROM patient_profiles ORDER BY display_name ASC"
  );
}

export async function getProfileById(id: string): Promise<PatientProfile | null> {
  const db = await getDatabase();
  return (
    (await db.getFirstAsync<PatientProfile>(
      "SELECT * FROM patient_profiles WHERE id = ?",
      id
    )) ?? null
  );
}

export async function getTodayReminders(patientId: string): Promise<Reminder[]> {
  const db = await getDatabase();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return db.getAllAsync<Reminder>(
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
export async function markReminderDone(
  id: string,
  isDone: boolean
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE reminders
     SET is_done = ?, completed_at = ?
     WHERE id = ?`,
    isDone ? 1 : 0,
    isDone ? new Date().toISOString() : null,
    id
  );
}

// TODO: [games teammate] implement game session persistence and sync
export async function saveGameSessionStub(
  patientId: string,
  gameType: string,
  score: number
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
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

export async function getTodayGameSessionCount(
  patientId: string
): Promise<number> {
  const db = await getDatabase();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const result = await db.getFirstAsync<{ count: number }>(
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
