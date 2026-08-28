import { create } from "zustand";

import {
  getTodayReminders,
  markReminderDone as markReminderDoneInDb,
} from "@/db/database";
import type { Reminder } from "@/db/schema";

interface ReminderState {
  reminders: Reminder[];
  loadTodayReminders: (patientId: string) => void;
  toggleDone: (id: string) => void;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  loadTodayReminders: (patientId) => {
    const reminders = getTodayReminders(patientId);
    set({ reminders });
  },
  toggleDone: (id) => {
    const current = get().reminders.find((item) => item.id === id);
    if (!current) return;

    const nextDone = current.is_done === 0;
    markReminderDoneInDb(id, nextDone);

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
