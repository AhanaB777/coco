import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { IconTile } from "@/components/IconTile";
import { ScreenLayout } from "@/components/ScreenLayout";
import { WelcomeCard } from "@/components/WelcomeCard";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme";

export const HOME_INSTRUCTIONS =
  "Welcome home. Tap Play for games, Reminders for today's tasks, Progress to see your activity, or Voice to talk.";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const activeProfileName = useAuthStore((state) => state.activeProfileName);

  useSpeakOnMount(
    activeProfileName
      ? `Welcome back, ${activeProfileName}. ${HOME_INSTRUCTIONS}`
      : HOME_INSTRUCTIONS
  );

  return (
    <ScreenLayout>
      <WelcomeCard
        name={activeProfileName ?? "Friend"}
        message="What would you like to do today?"
      />

      <View style={styles.grid}>
        <View style={styles.row}>
          <IconTile
            label="Play"
            iconName="game-controller-outline"
            accentColor={theme.colors.tilePlay}
            backgroundColor={theme.colors.tilePlayBg}
            onPress={() => navigation.navigate("Play")}
            accessibilityHint="Open cognitive games"
          />
          <IconTile
            label="Reminders"
            iconName="alarm-outline"
            accentColor={theme.colors.tileReminders}
            backgroundColor={theme.colors.tileRemindersBg}
            onPress={() => navigation.navigate("Reminders")}
            accessibilityHint="View today's reminders"
          />
        </View>
        <View style={styles.row}>
          <IconTile
            label="Progress"
            iconName="stats-chart-outline"
            accentColor={theme.colors.tileProgress}
            backgroundColor={theme.colors.tileProgressBg}
            onPress={() => navigation.navigate("Progress")}
            accessibilityHint="See your daily progress"
          />
          <IconTile
            label="Voice"
            iconName="mic-outline"
            accentColor={theme.colors.tileVoice}
            backgroundColor={theme.colors.tileVoiceBg}
            onPress={() => navigation.navigate("Voice")}
            accessibilityHint="Open voice assistant"
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    gap: theme.touch.gap,
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: theme.touch.gap,
  },
});
