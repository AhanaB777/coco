import type { GameType } from "@/types/api";

export type RootStackParamList = {
  Splash: undefined;
  LoginPin: undefined;
  Home: undefined;
  Play: undefined;
  GameStub: { gameType: GameType };
  Reminders: undefined;
  Progress: undefined;
  Voice: undefined;
};

export const GAME_LABELS: Record<GameType, string> = {
  memory_match: "Memory Match",
  sequence_recall: "Sequence Recall",
  object_recognition: "Object Recognition",
};
