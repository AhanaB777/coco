import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { IconTile } from "@/components/IconTile";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import type { GameType } from "@/db/schema";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { GAME_LABELS, type RootStackParamList } from "@/navigation/types";
import { theme } from "@/theme";

export const PLAY_INSTRUCTIONS =
  "Choose a game to play. Tap a game card to begin.";

type Props = NativeStackScreenProps<RootStackParamList, "Play">;

const GAMES: {
  type: GameType;
  icon: "grid-outline" | "list-outline" | "eye-outline";
  accent: string;
  bg: string;
}[] = [
  {
    type: "memory_match",
    icon: "grid-outline",
    accent: theme.colors.tilePlay,
    bg: theme.colors.tilePlayBg,
  },
  {
    type: "sequence_recall",
    icon: "list-outline",
    accent: theme.colors.tileProgress,
    bg: theme.colors.tileProgressBg,
  },
  {
    type: "object_recognition",
    icon: "eye-outline",
    accent: theme.colors.tileVoice,
    bg: theme.colors.tileVoiceBg,
  },
];

export function PlayScreen({ navigation }: Props) {
  useSpeakOnMount(PLAY_INSTRUCTIONS);

  return (
    <ScreenLayout scrollable>
      <ScreenHeader
        title="Play"
        subtitle="Memory, attention, and recognition games"
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.list}>
        {GAMES.map((game) => (
          <IconTile
            key={game.type}
            label={GAME_LABELS[game.type]}
            iconName={game.icon}
            flex={0}
            accentColor={game.accent}
            backgroundColor={game.bg}
            onPress={() =>
              navigation.navigate("GameStub", { gameType: game.type })
            }
            accessibilityHint={`Open ${GAME_LABELS[game.type]} game`}
          />
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.touch.gap,
  },
});
