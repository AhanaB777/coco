import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { fetchPatientProgress } from "@/services/progress";
import { useAuthStore } from "@/stores/authStore";
import type { ProgressMetrics } from "@/types/api";
import { goldThreadAccent, surfaceCard, theme } from "@/theme";

export const PROGRESS_INSTRUCTIONS =
  "Here is your progress. Keep playing to stay active.";

type Props = NativeStackScreenProps<RootStackParamList, "Progress">;

export function ProgressScreen({ navigation }: Props) {
  const patientId = useAuthStore((state) => state.patientId);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    fetchPatientProgress()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch(() => {
        if (active) setError("Could not load progress. Check your connection.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  const summary = metrics
    ? metrics.total_sessions > 0
      ? `You have played ${metrics.total_sessions} game${metrics.total_sessions === 1 ? "" : "s"} in total.`
      : "No games recorded yet. Tap Play on the home screen to start."
    : "";

  useSpeakOnMount(
    metrics ? `${summary} ${PROGRESS_INSTRUCTIONS}` : PROGRESS_INSTRUCTIONS
  );

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Progress"
        subtitle="Your activity summary"
        onHomePress={() => navigation.navigate("Home")}
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
          accessibilityLabel="Loading progress"
        />
      ) : error ? (
        <View style={styles.card}>
          <Text style={styles.errorText} allowFontScaling accessibilityRole="alert">
            {error}
          </Text>
        </View>
      ) : metrics ? (
        <View style={styles.card}>
          <View style={styles.goldAccent} />
          <Text style={styles.celebration} allowFontScaling accessibilityLabel="Celebration">
            Well done!
          </Text>
          <Text style={styles.summary} allowFontScaling>
            {summary}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue} allowFontScaling>
                {metrics.total_sessions}
              </Text>
              <Text style={styles.statLabel} allowFontScaling>
                Sessions
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue} allowFontScaling>
                {metrics.average_score}
              </Text>
              <Text style={styles.statLabel} allowFontScaling>
                Avg score
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue} allowFontScaling>
                {metrics.streak_days}
              </Text>
              <Text style={styles.statLabel} allowFontScaling>
                Day streak
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: theme.spacing.xl,
  },
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
  celebration: {
    ...theme.typography.label,
    color: theme.colors.gold,
    marginTop: theme.spacing.xs,
  },
  summary: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.destructive,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.border.subtleWidth,
    borderTopColor: theme.colors.borderSubtle,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: theme.colors.borderSubtle,
  },
  statValue: {
    ...theme.typography.headline,
    color: theme.colors.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    textAlign: "center",
  },
});
