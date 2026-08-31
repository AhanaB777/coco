import * as Speech from "expo-speech";

import type { NarratorLanguageCode } from "@/constants/narratorLanguages";
import { getNarratorLanguage } from "@/constants/narratorLanguages";

export interface ResolvedSpeechVoice {
  language: string;
  voice?: string;
  usedFallback: boolean;
}

/** Locale candidates per language — first match on device wins */
const LOCALE_CANDIDATES: Record<NarratorLanguageCode, string[]> = {
  en: ["en-IN", "en-GB", "en-US", "en"],
  hi: ["hi-IN", "hi"],
  // Assamese voices are rare on iOS/Android; Bengali shares the script and is
  // commonly preinstalled on Indian devices.
  as: ["as-IN", "as", "asm-IN", "asm", "bn-IN", "bn", "hi-IN", "en-IN"],
  bn: ["bn-IN", "bn", "bn-BD"],
};

let cachedVoices: Speech.Voice[] | null = null;

function normalizeLocale(locale: string): string {
  return locale.toLowerCase().replace(/_/g, "-");
}

function localeMatches(voiceLocale: string, candidate: string): boolean {
  const voice = normalizeLocale(voiceLocale);
  const target = normalizeLocale(candidate);

  if (voice === target) return true;
  if (voice.startsWith(`${target}-`)) return true;

  const voiceBase = voice.split("-")[0];
  const targetBase = target.split("-")[0];
  return voiceBase === targetBase;
}

export async function getDeviceVoices(): Promise<Speech.Voice[]> {
  if (!cachedVoices) {
    cachedVoices = await Speech.getAvailableVoicesAsync();
  }
  return cachedVoices;
}

export function clearDeviceVoiceCache(): void {
  cachedVoices = null;
}

export async function resolveSpeechVoice(
  code: NarratorLanguageCode
): Promise<ResolvedSpeechVoice> {
  const voices = await getDeviceVoices();
  const candidates =
    LOCALE_CANDIDATES[code] ?? [getNarratorLanguage(code).speechLocale];
  const primaryLocale = normalizeLocale(candidates[0]);

  for (const candidate of candidates) {
    const match = voices.find((voice) => localeMatches(voice.language, candidate));
    if (match) {
      return {
        language: match.language,
        voice: match.identifier,
        usedFallback: !localeMatches(match.language, primaryLocale),
      };
    }
  }

  return {
    language: candidates[0],
    usedFallback: true,
  };
}
