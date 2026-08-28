import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BigButton } from "@/components/BigButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { GAME_LABELS, type RootStackParamList } from "@/navigation/types";
import { theme, wovenBorder } from "@/theme";

export const GAME_STUB_INSTRUCTIONS =
  "This game is coming soon. Your teammate will add the game here.";

type Props = NativeStackScreenProps<RootStackParamList, "GameStub">;

export function GameStubScreen({ navigation, route }: Props) {
  const { gameType } = route.params;
  const gameLabel = GAME_LABELS[gameType];

  useSpeakOnMount(`${gameLabel}. ${GAME_STUB_INSTRUCTIONS}`);

  return (
    <ScreenLayout>
      <ScreenHeader
        title={gameLabel}
        subtitle="Game coming soon"
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.card}>
        <Text style={styles.title} allowFontScaling>
          Coming soon
        </Text>
        <Text style={styles.body} allowFontScaling>
          {/* TODO: [games teammate] mount game component for {gameType} here */}
          The {gameLabel} game will appear in this space. Game logic and scoring
          will be wired by the games teammate.
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
    ...wovenBorder,
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.goldBorder,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
});
