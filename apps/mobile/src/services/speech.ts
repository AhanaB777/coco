import * as Speech from "expo-speech";

// TODO: [voice teammate] wire to Groq TTS or multilingual voice pipeline
export async function speakInstructions(text: string): Promise<void> {
  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) {
    await Speech.stop();
  }

  return new Promise((resolve) => {
    Speech.speak(text, {
      language: "en-IN",
      rate: 0.9,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}
