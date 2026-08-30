import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { speakInstructions } from "@/services/speech";

export function useSpeakOnMount(instructions: string): void {
  useFocusEffect(
    useCallback(() => {
      // Empty string means "not ready yet" (e.g. data still loading) — skip so
      // we don't speak twice when the real instructions arrive.
      if (instructions) {
        void speakInstructions(instructions);
      }
    }, [instructions])
  );
}
