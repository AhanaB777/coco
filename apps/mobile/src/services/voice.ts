export type VoiceUiState = "idle" | "listening" | "speaking";

type TranscriptHandler = (text: string) => void;

let transcriptHandler: TranscriptHandler | null = null;

export async function startListening(
  onTranscript: TranscriptHandler
): Promise<void> {
  transcriptHandler = onTranscript;
}

export async function stopListening(): Promise<void> {
  transcriptHandler = null;
}

export async function speakResponse(text: string): Promise<void> {
  if (transcriptHandler) {
    transcriptHandler(text);
  }
}

export function getVoiceStateLabel(
  state: VoiceUiState,
  t: (path: string) => string
): string {
  switch (state) {
    case "listening":
      return t("voice.listening");
    case "speaking":
      return t("voice.speaking");
    default:
      return t("voice.idle");
  }
}
