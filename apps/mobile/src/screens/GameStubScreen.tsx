import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BigButton } from "@/components/BigButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { GAME_LABELS, type RootStackParamList } from "@/navigation/types";
import { launchGame } from "@/services/games";
import { useAuthStore } from "@/stores/authStore";
import { goldThreadAccent, surfaceCard, theme } from "@/theme";

export const GAME_STUB_INSTRUCTIONS =
  "This game is coming soon. Your teammate will add the game here.";

type Props = NativeStackScreenProps<RootStackParamList, "GameStub">;

export function GameStubScreen({ navigation, route }: Props) {
  const { gameType } = route.params;
  const gameLabel = GAME_LABELS[gameType];
  const patientId = useAuthStore((state) => state.patientId);

  useSpeakOnMount(`${gameLabel}. ${GAME_STUB_INSTRUCTIONS}`);

  useEffect(() => {
    if (patientId) {
      launchGame(gameType, patientId).catch((error) =>
        console.error("Failed to record game session", error)
      );
    }
  }, [gameType, patientId]);

  return (
    <ScreenLayout>
      <ScreenHeader
        title={gameLabel}
        subtitle="Game coming soon"
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.card}>
        <View style={styles.goldAccent} />
        <Text style={styles.title} allowFontScaling>
          Coming soon
        </Text>
        <Text style={styles.body} allowFontScaling>
          The {gameLabel} game will appear in this space. A practice session has
          been saved to your progress.
        </Text>

        <BigButton
          label="Back to games"
          variant="outline"
          onPress={() => navigation.navigate("Play")}
          accessibilityHint="Return to the game list"
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    ...surfaceCard({ warm: true }),
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.lg + 4,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  goldAccent: {
    ...goldThreadAccent,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.foreground,
    marginTop: theme.spacing.xs,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
});
