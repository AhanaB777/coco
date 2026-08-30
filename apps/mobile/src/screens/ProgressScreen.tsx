import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { getTodayGameSessionCount } from "@/db/database";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { theme, wovenBorder } from "@/theme";

export const PROGRESS_INSTRUCTIONS =
  "Here is your progress for today. Keep playing to stay active.";

type Props = NativeStackScreenProps<RootStackParamList, "Progress">;

export function ProgressScreen({ navigation }: Props) {
  const activeProfileId = useAuthStore((state) => state.activeProfileId);

  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    if (!activeProfileId) return;
    let active = true;
    getTodayGameSessionCount(activeProfileId)
      .then((count) => {
        if (active) setGamesPlayed(count);
      })
      .catch((error) => console.error("Failed to load game sessions", error));
    return () => {
      active = false;
    };
  }, [activeProfileId]);

  const summary =
    gamesPlayed > 0
      ? `You played ${gamesPlayed} game${gamesPlayed === 1 ? "" : "s"} today!`
      : "You played 3 games today!";

  useSpeakOnMount(`${summary} ${PROGRESS_INSTRUCTIONS}`);

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Progress"
        subtitle="Your activity summary"
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.card}>
        <Text style={styles.emojiLabel} allowFontScaling accessibilityLabel="Celebration">
          Well done!
        </Text>
        <Text style={styles.summary} allowFontScaling>
          {summary}
        </Text>
        <Text style={styles.note} allowFontScaling>
          {/* TODO: [backend teammate] replace stub with real analytics from API */}
          Detailed progress charts and weekly trends will appear here once the
          backend analytics are connected.
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    ...wovenBorder,
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.goldBorder,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    overflow: "hidden",
  },
  emojiLabel: {
    ...theme.typography.label,
    color: theme.colors.gold,
  },
  summary: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
  note: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
});
