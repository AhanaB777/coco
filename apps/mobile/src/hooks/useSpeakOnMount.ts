import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { speakInstructions } from "@/services/speech";

export function useSpeakOnMount(instructions: string): void {
  useFocusEffect(
    useCallback(() => {
      void speakInstructions(instructions);
    }, [instructions])
  );
}
