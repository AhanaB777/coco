export type GameId = 'memory' | 'pattern' | 'naming';

export type StarRating = 1 | 2 | 3;

export interface SessionRecord {
  /** ISO date string of when this session was completed */
  date: string;
  stars: StarRating;
  /** difficulty level the session was played at */
  level: number;
  hintsUsed: number;
  durationMs: number;
}

export interface GameProgress {
  /** current adaptive difficulty level, 1-based */
  level: number;
  /** most recent sessions first is NOT required — stored oldest-to-newest, capped */
  history: SessionRecord[];
  bestStars: StarRating | 0;
  totalSessions: number;
}

export const DEFAULT_PROGRESS: GameProgress = {
  level: 1,
  history: [],
  bestStars: 0,
  totalSessions: 0,
};

export const MAX_HISTORY_LENGTH = 20;
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 5;
