import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppIcon } from "@/components/AppIcon";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { useTranslation } from "@/i18n";
import type { RootStackParamList } from "@/navigation/types";
import { speakInstructions } from "@/services/speech";
import {
  getVoiceStateLabel,
  startListening,
  stopListening,
  type VoiceUiState,
} from "@/services/voice";
import { theme } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Voice">;

export function VoiceScreen({ navigation }: Props) {
  const [state, setState] = useState<VoiceUiState>("idle");
  const { t } = useTranslation();

  useSpeakOnMount(t("voice.instructions"));

  const handleMicPress = async () => {
    if (state === "idle") {
      setState("listening");
      await startListening((transcript) => {
        console.log("Voice transcript stub:", transcript);
      });
      return;
    }

    if (state === "listening") {
      await stopListening();
      setState("speaking");
      await speakInstructions(t("voice.thanks"));
      setState("idle");
    }
  };

  const micColor =
    state === "listening"
      ? theme.colors.accent
      : state === "speaking"
        ? theme.colors.primaryDark
        : theme.colors.tileVoice;

  return (
    <ScreenLayout>
      <ScreenHeader
        title={t("voice.title")}
        subtitle={t("voice.subtitle")}
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.container}>
        <Text style={styles.status} allowFontScaling accessibilityLiveRegion="polite">
          {getVoiceStateLabel(state, t)}
        </Text>

        <Pressable
          onPress={handleMicPress}
          accessibilityRole="button"
          accessibilityLabel={
            state === "listening"
              ? t("voice.stopListening")
              : t("voice.startListening")
          }
          accessibilityHint={t("voice.micHint")}
          style={({ pressed }) => [
            styles.micButton,
            state === "listening" && styles.micListening,
            state === "speaking" && styles.micSpeaking,
            pressed && styles.pressed,
          ]}
        >
          <AppIcon
            name={state === "listening" ? "StopCircle" : "Microphone"}
            size={96}
            color={micColor}
            weight="fill"
          />
        </Pressable>

        <Text style={styles.hint} allowFontScaling>
          {t("voice.hint")}
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  status: {
    ...theme.typography.title,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  micButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: theme.border.width * 2,
    borderColor: theme.colors.goldBorder,
    backgroundColor: theme.colors.tileVoiceBg,
    alignItems: "center",
    justifyContent: "center",
  },
  micListening: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.tileProgressBg,
  },
  micSpeaking: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.tilePlayBg,
  },
  pressed: {
    opacity: 0.92,
  },
  hint: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
  },
});
