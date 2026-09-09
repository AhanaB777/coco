import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { IconTile } from "@/components/IconTile";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import type { GameType } from "@/types/api";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { useTranslation } from "@/i18n";
import type { RootStackParamList } from "@/navigation/types";
import { theme } from "@/theme";
import { loadAllProgress } from "@/utils/storage";
import type { GameId, GameProgress } from "@/utils/types";

type Props = NativeStackScreenProps<RootStackParamList, "Play">;

type GameRoute = "Memory" | "Pattern" | "Naming";

const GAMES: {
  type: GameType;
  accent: string;
  bg: string;
  route: GameRoute;
}[] = [
  {
    type: "memory_match",
    accent: theme.colors.tilePlay,
    bg: theme.colors.tilePlayBg,
    route: "Memory",
  },
  {
    type: "sequence_recall",
    accent: theme.colors.tileProgress,
    bg: theme.colors.tileProgressBg,
    route: "Pattern",
  },
  {
    type: "object_recognition",
    accent: theme.colors.tileVoice,
    bg: theme.colors.tileVoiceBg,
    route: "Naming",
  },
];

const GAME_ICONS = {
  memory_match: "SquaresFour",
  sequence_recall: "ListNumbers",
  object_recognition: "Scan",
} as const;

const GAME_PROGRESS_IDS: Record<GameType, GameId> = {
  memory_match: "memory",
  sequence_recall: "pattern",
  object_recognition: "naming",
};

export function PlayScreen({ navigation }: Props) {
  const { t, gameLabel } = useTranslation();
  const [progress, setProgress] = useState<Record<GameId, GameProgress>>();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void loadAllProgress().then((loaded) => {
        if (!cancelled) setProgress(loaded);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  useSpeakOnMount(t("play.instructions"));

  return (
    <ScreenLayout scrollable>
      <ScreenHeader
        title={t("play.title")}
        subtitle={t("play.subtitle")}
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.list}>
        {GAMES.map((game) => (
          <IconTile
            key={game.type}
            label={gameLabel(game.type)}
            iconName={GAME_ICONS[game.type]}
            flex={0}
            accentColor={game.accent}
            backgroundColor={game.bg}
            gameLayout
            level={progress?.[GAME_PROGRESS_IDS[game.type]]?.level}
            stars={progress?.[GAME_PROGRESS_IDS[game.type]]?.bestStars}
            onPress={() =>
              navigation.navigate(game.route, { gameType: game.type })
            }
            accessibilityHint={t("play.gameHint", { game: gameLabel(game.type) })}
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
