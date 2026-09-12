import { Audio } from "expo-av";

export type VoiceUiState = "idle" | "listening" | "thinking" | "speaking";

export interface RecordingResult {
  uri: string;
  mimeType: string;
  durationMillis: number;
}

/** Anything shorter is an accidental tap; Whisper hallucinates text for it. */
export const MIN_RECORDING_MS = 700;
/** Cap so a forgotten open mic does not upload an unbounded file. */
export const MAX_RECORDING_MS = 60_000;

/**
 * Whisper resamples everything to 16 kHz mono before decoding, so the stock
 * 44.1 kHz stereo preset only makes the upload larger on weak rural networks.
 */
const SPEECH_RECORDING_OPTIONS: Audio.RecordingOptions = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  android: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
};

let activeRecording: Audio.Recording | null = null;

export async function requestMicPermission(): Promise<boolean> {
  const permission = await Audio.requestPermissionsAsync();
  return permission.granted;
}

/**
 * Returns the session to plain playback.
 *
 * Leaving iOS in `PlayAndRecord` routes output to the earpiece rather than the
 * speaker, which makes the assistant's spoken reply almost inaudible right
 * after the patient finishes talking.
 */
export async function resetAudioModeForPlayback(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  } catch {
    // The session is best-effort; never let it break the recording flow.
  }
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

  // expo-av allows one prepared Recording at a time. A clip left behind by a
  // failed stop, a Fast Refresh or a crashed request would otherwise make
  // every later tap fail with "Only one Recording object can be prepared".
  await discardStaleRecording();

  try {
    activeRecording = await createRecording(SPEECH_RECORDING_OPTIONS);
  } catch (compactError) {
    // iOS refuses to prepare a 16 kHz AAC recorder on some inputs (seen on
    // the simulator while the Mac's default microphone was a Bluetooth
    // headset). A larger upload beats a dead microphone, so retry with the
    // stock preset before giving up.
    console.warn(
      "Compact speech recording refused, retrying with the default preset",
      compactError
    );
    try {
      activeRecording = await createRecording(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
    } catch (error) {
      await resetAudioModeForPlayback();
      throw error;
    }
  }
}

async function createRecording(
  options: Audio.RecordingOptions
): Promise<Audio.Recording> {
  const { recording } = await Audio.Recording.createAsync(options);
  return recording;
}

async function discardStaleRecording(): Promise<void> {
  const stale = activeRecording;
  activeRecording = null;
  if (!stale) {
    return;
  }
  try {
    await stale.stopAndUnloadAsync();
  } catch {
    // Already unloaded, or never finished preparing; nothing to release.
  }
}

export async function stopRecording(): Promise<RecordingResult | null> {
  if (!activeRecording) {
    return null;
  }

  const recording = activeRecording;
  activeRecording = null;

  try {
    let durationMillis = 0;
    try {
      durationMillis = (await recording.getStatusAsync()).durationMillis ?? 0;
    } catch {
      // Unknown duration must not block the upload; the server still guards.
    }
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri ? { uri, mimeType: "audio/m4a", durationMillis } : null;
  } finally {
    // In a finally block so a failed unload cannot strand the session in
    // record mode and silence every later utterance.
    await resetAudioModeForPlayback();
  }
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
