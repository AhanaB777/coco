import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

import {
  CREATE_GAME_SESSIONS_TABLE,
  CREATE_PATIENT_PROFILES_TABLE,
  CREATE_REMINDERS_TABLE,
} from "@/db/schema";

const DB_NAME = "coco.db";

let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DB_NAME);
  }
  return databasePromise;
}

/** Creates local tables for optional offline cache (API is source of truth). */
export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(CREATE_PATIENT_PROFILES_TABLE);
  await db.execAsync(CREATE_REMINDERS_TABLE);
  await db.execAsync(CREATE_GAME_SESSIONS_TABLE);
}
