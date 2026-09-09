import { SessionRecord, MIN_LEVEL, MAX_LEVEL } from './types';

/**
 * Adaptive difficulty rule, shared by all three games:
 *
 * - A 1-star session (struggled) eases difficulty down immediately by one
 *   level. We react fast to struggle so the person doesn't get stuck in a
 *   frustrating loop.
 * - Difficulty only goes UP after two consecutive 3-star sessions in a row,
 *   so a single lucky round doesn't push someone into a level that's too
 *   hard.
 * - A 2-star session holds the current level steady.
 *
 * This function is pure and easy to unit test — it takes the full session
 * history and returns the level the *next* session should be played at.
 */
export function computeNextLevel(
  currentLevel: number,
  history: SessionRecord[],
  minLevel: number = MIN_LEVEL,
  maxLevel: number = MAX_LEVEL
): number {
  if (history.length === 0) {
    return clamp(currentLevel, minLevel, maxLevel);
  }

  const lastTwo = history.slice(-2).map((h) => h.stars);
  const last = lastTwo[lastTwo.length - 1];

  if (last === 1) {
    return clamp(currentLevel - 1, minLevel, maxLevel);
  }

  if (lastTwo.length === 2 && lastTwo.every((s) => s === 3)) {
    return clamp(currentLevel + 1, minLevel, maxLevel);
  }

  return clamp(currentLevel, minLevel, maxLevel);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Turns raw session performance into a 1-3 star rating. Each game computes
 * its own "accuracy" and "speedFactor" inputs (0-1 each; speedFactor is
 * omitted — pass 1 — for games where speed shouldn't be scored), then this
 * shared curve converts it to stars so the star meaning stays consistent
 * across games. Hints reduce the effective accuracy slightly so stars still
 * reward independent play without ever going to a punishing zero.
 */
export function scoreToStars(
  accuracy: number, // 0-1
  hintsUsed: number
): 1 | 2 | 3 {
  const hintPenalty = Math.min(0.15, hintsUsed * 0.05);
  const adjusted = Math.max(0, Math.min(1, accuracy - hintPenalty));

  if (adjusted >= 0.85) return 3;
  if (adjusted >= 0.6) return 2;
  return 1;
}
