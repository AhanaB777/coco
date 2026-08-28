import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ReminderType } from "@/db/schema";
import { theme, wovenBorder } from "@/theme";

interface ReminderCardProps {
  title: string;
  reminderType: ReminderType;
  scheduledAt: string;
  isDone: boolean;
  onToggleDone: () => void;
}

const TYPE_LABELS: Record<ReminderType, string> = {
  medicine: "Medicine",
  hydration: "Hydration",
  appointment: "Appointment",
};

export function ReminderCard({
  title,
  reminderType,
  scheduledAt,
  isDone,
  onToggleDone,
}: ReminderCardProps) {
  const timeLabel = new Date(scheduledAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText} allowFontScaling>
            {TYPE_LABELS[reminderType]}
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
          isDone ? `Mark ${title} as not done` : `Mark ${title} as done`
        }
        accessibilityState={{ checked: isDone }}
        style={({ pressed }) => [
          styles.checkButton,
          isDone && styles.checkButtonDone,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name={isDone ? "checkmark-circle" : "ellipse-outline"}
          size={40}
          color={isDone ? theme.colors.onAccent : theme.colors.primary}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...wovenBorder,
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.goldBorder,
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
    borderWidth: 1,
    borderColor: theme.colors.goldBorder,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    fontFamily: "AtkinsonHyperlegible_700Bold",
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
    borderRadius: theme.border.radius,
    borderWidth: theme.border.width,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  checkButtonDone: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  pressed: {
    opacity: 0.9,
  },
});
