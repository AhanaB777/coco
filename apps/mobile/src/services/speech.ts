import * as Speech from "expo-speech";

import type { NarratorLanguageCode } from "@/constants/narratorLanguages";
import { getPreferredNarratorLanguage } from "@/stores/authStore";

import { resolveSpeechVoice } from "./speechVoices";

export interface SpeakInstructionsOptions {
  language?: string;
  voice?: string;
  languageCode?: NarratorLanguageCode;
}

export async function speakInstructions(
  text: string,
  options?: SpeakInstructionsOptions
): Promise<void> {
  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) {
    await Speech.stop();
  }

  let language = options?.language;
  let voice = options?.voice;

  if (!language) {
    const code = options?.languageCode ?? getPreferredNarratorLanguage();
    const resolved = await resolveSpeechVoice(code);
    language = resolved.language;
    voice = resolved.voice;
  }

  return new Promise((resolve) => {
    Speech.speak(text, {
      language,
      voice,
      rate: 0.9,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}
