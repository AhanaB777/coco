import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { ReminderCard } from "@/components/ReminderCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { useReminderStore } from "@/stores/reminderStore";
import { theme } from "@/theme";

export const REMINDERS_INSTRUCTIONS =
  "Here are today's reminders. Tap the checkmark when you finish one.";

type Props = NativeStackScreenProps<RootStackParamList, "Reminders">;

export function RemindersScreen({ navigation }: Props) {
  const activeProfileId = useAuthStore((state) => state.activeProfileId);
  const reminders = useReminderStore((state) => state.reminders);
  const loadTodayReminders = useReminderStore(
    (state) => state.loadTodayReminders
  );
  const toggleDone = useReminderStore((state) => state.toggleDone);

  useSpeakOnMount(REMINDERS_INSTRUCTIONS);

  useFocusEffect(
    useCallback(() => {
      if (activeProfileId) {
        loadTodayReminders(activeProfileId);
      }
    }, [activeProfileId, loadTodayReminders])
  );

  return (
    <ScreenLayout scrollable>
      <ScreenHeader
        title="Reminders"
        subtitle="Today's medicine, water, and appointments"
        onHomePress={() => navigation.navigate("Home")}
      />

      {reminders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText} allowFontScaling>
            No reminders for today.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ReminderCard
              title={item.title}
              reminderType={item.reminder_type}
              scheduledAt={item.scheduled_at}
              isDone={item.is_done === 1}
              onToggleDone={() => toggleDone(item.id)}
            />
          )}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  empty: {
    ...theme.typography.body,
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: "center",
  },
});
