export type VoiceUiState = "idle" | "listening" | "speaking";

type TranscriptHandler = (text: string) => void;

let transcriptHandler: TranscriptHandler | null = null;

// TODO: [voice teammate] wire STT (on-device or Groq) and TTS response pipeline
export async function startListening(
  onTranscript: TranscriptHandler
): Promise<void> {
  transcriptHandler = onTranscript;
}

export async function stopListening(): Promise<void> {
  transcriptHandler = null;
}

export async function speakResponse(text: string): Promise<void> {
  // TODO: [voice teammate] replace with multilingual TTS
  if (transcriptHandler) {
    transcriptHandler(text);
  }
}

export function getVoiceStateLabel(state: VoiceUiState): string {
  switch (state) {
    case "listening":
      return "Listening";
    case "speaking":
      return "Speaking";
    default:
      return "Tap microphone to talk";
  }
}
