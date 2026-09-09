import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GameId,
  GameProgress,
  DEFAULT_PROGRESS,
  SessionRecord,
  MAX_HISTORY_LENGTH,
} from './types';
import { computeNextLevel } from './difficulty';

const STORAGE_PREFIX = '@smriti-sparks/progress/';

function keyFor(gameId: GameId): string {
  return `${STORAGE_PREFIX}${gameId}`;
}

export async function loadProgress(gameId: GameId): Promise<GameProgress> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(gameId));
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as GameProgress;
    // Defensive defaults in case a future version adds fields.
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (err) {
    console.warn(`[storage] Failed to load progress for ${gameId}`, err);
    return { ...DEFAULT_PROGRESS };
  }
}

export async function loadAllProgress(): Promise<Record<GameId, GameProgress>> {
  const [memory, pattern, naming] = await Promise.all([
    loadProgress('memory'),
    loadProgress('pattern'),
    loadProgress('naming'),
  ]);
  return { memory, pattern, naming };
}

/**
 * Records a completed session: appends it to history (capped), recomputes
 * the adaptive difficulty level for next time, updates best-stars, and
 * persists the result. Returns the updated progress so the UI can reflect
 * it immediately without a re-read.
 */
export async function recordSession(
  gameId: GameId,
  session: SessionRecord
): Promise<GameProgress> {
  const current = await loadProgress(gameId);

  const history = [...current.history, session].slice(-MAX_HISTORY_LENGTH);
  const nextLevel = computeNextLevel(current.level, history);
  const bestStars = Math.max(current.bestStars, session.stars) as GameProgress['bestStars'];

  const updated: GameProgress = {
    level: nextLevel,
    history,
    bestStars,
    totalSessions: current.totalSessions + 1,
  };

  try {
    await AsyncStorage.setItem(keyFor(gameId), JSON.stringify(updated));
    console.log(`[storage] Saved progress for ${gameId}:`, updated);
  } catch (err) {
    console.warn(`[storage] Failed to save progress for ${gameId}`, err);
  }

  return updated;
}

/** Used only for a future "reset progress" settings option. */
export async function resetProgress(gameId: GameId): Promise<void> {
  await AsyncStorage.removeItem(keyFor(gameId));
}
