import { create } from "zustand";

import {
  getTodayReminders,
  markReminderDone as markReminderDoneInDb,
} from "@/db/database";
import type { Reminder } from "@/db/schema";

interface ReminderState {
  reminders: Reminder[];
  loadTodayReminders: (patientId: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  loadTodayReminders: async (patientId) => {
    const reminders = await getTodayReminders(patientId);
    set({ reminders });
  },
  toggleDone: async (id) => {
    const current = get().reminders.find((item) => item.id === id);
    if (!current) return;

    const nextDone = current.is_done === 0;
    await markReminderDoneInDb(id, nextDone);

    set({
      reminders: get().reminders.map((item) =>
        item.id === id
          ? {
              ...item,
              is_done: nextDone ? 1 : 0,
              completed_at: nextDone ? new Date().toISOString() : null,
            }
          : item
      ),
    });
  },
}));
