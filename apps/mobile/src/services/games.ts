import type { GameType } from "@/db/schema";

export interface LaunchGameResult {
  started: boolean;
  message: string;
}

// TODO: [games teammate] mount actual game modules and return session metadata
export async function launchGame(
  gameType: GameType,
  patientId: string
): Promise<LaunchGameResult> {
  return {
    started: false,
    message: `Game shell ready for ${gameType} (patient: ${patientId})`,
  };
}
