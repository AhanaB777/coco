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
  Settings: undefined;
};
