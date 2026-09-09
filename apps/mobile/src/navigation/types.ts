import type { GameType } from "@/types/api";

export type RootStackParamList = {
  Splash: undefined;
  LoginPin: undefined;
  Home: undefined;
  Play: undefined;
  GameStub: { gameType: GameType };
  Memory: { gameType: GameType };
  Pattern: { gameType: GameType };
  Naming: { gameType: GameType };
  Reminders: undefined;
  Progress: undefined;
  Voice: undefined;
  Settings: undefined;
};
