import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import type { ReminderType } from "@/types/api";
import { useTranslation } from "@/i18n";
import { surfaceCard, theme } from "@/theme";

interface ReminderCardProps {
  title: string;
  reminderType: ReminderType;
  scheduledAt: string;
  isDone: boolean;
  onToggleDone: () => void;
}

export function ReminderCard({
  title,
  reminderType,
  scheduledAt,
  isDone,
  onToggleDone,
}: ReminderCardProps) {
  const { t, reminderTypeLabel } = useTranslation();

  const timeLabel = new Date(scheduledAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText} allowFontScaling>
            {reminderTypeLabel(reminderType)}
          </Text>
        </View>
        <Text
          style={[styles.title, isDone && styles.titleDone]}
          allowFontScaling
        >
          {title}
        </Text>
        <Text style={styles.time} allowFontScaling>
          {timeLabel}
        </Text>
      </View>

      <Pressable
        onPress={onToggleDone}
        accessibilityRole="checkbox"
        accessibilityLabel={
          isDone
            ? t("reminders.markNotDone", { title })
            : t("reminders.markDone", { title })
        }
        accessibilityState={{ checked: isDone }}
        style={({ pressed }) => [
          styles.checkButton,
          isDone && styles.checkButtonDone,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon
          name={isDone ? "CheckCircle" : "CircleDashed"}
          size={40}
          color={isDone ? theme.colors.onAccent : theme.colors.primaryDark}
          weight={isDone ? "fill" : "regular"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...surfaceCard(),
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.goldLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.tileReminders,
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontWeight: "600",
  },
  title: {
    ...theme.typography.label,
    color: theme.colors.foreground,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: theme.colors.muted,
  },
  time: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  checkButton: {
    minWidth: theme.touch.minTarget,
    minHeight: theme.touch.minTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: theme.border.subtleWidth,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceElevated,
    ...theme.elevation.sm,
  },
  checkButtonDone: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  pressed: {
    opacity: 0.92,
  },
});
