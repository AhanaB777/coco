import { Audio } from "expo-av";

export type VoiceUiState = "idle" | "listening" | "thinking" | "speaking";

export interface RecordingResult {
  uri: string;
  mimeType: string;
}

let activeRecording: Audio.Recording | null = null;

export async function requestMicPermission(): Promise<boolean> {
  const permission = await Audio.requestPermissionsAsync();
  return permission.granted;
}

export async function startRecording(): Promise<void> {
  const granted = await requestMicPermission();
  if (!granted) {
    throw new Error("MIC_PERMISSION_DENIED");
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  activeRecording = recording;
}

export async function stopRecording(): Promise<RecordingResult | null> {
  if (!activeRecording) {
    return null;
  }

  await activeRecording.stopAndUnloadAsync();
  const uri = activeRecording.getURI();
  activeRecording = null;

  if (!uri) {
    return null;
  }

  return {
    uri,
    mimeType: "audio/m4a",
  };
}

export function getVoiceStateLabel(
  state: VoiceUiState,
  t: (path: string) => string
): string {
  switch (state) {
    case "listening":
      return t("voice.listening");
    case "thinking":
      return t("voice.thinking");
    case "speaking":
      return t("voice.speaking");
    default:
      return t("voice.idle");
  }
}
