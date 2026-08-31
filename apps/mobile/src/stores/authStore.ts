import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_PATIENT_ID, DEFAULT_PATIENT_NAME } from "@/constants/patient";

interface AuthState {
  /** Device-bound backend patient UUID */
  patientId: string | null;
  patientName: string | null;
  preferredLanguage: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  /** Bind this device to a single patient account (dev/setup). */
  bindPatient: (patientId: string) => void;
  setSession: (params: {
    accessToken: string;
    patientId: string;
    patientName: string;
    preferredLanguage?: string | null;
  }) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      patientId: DEFAULT_PATIENT_ID,
      patientName: DEFAULT_PATIENT_NAME,
      preferredLanguage: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      bindPatient: (patientId) =>
        set({
          patientId,
          patientName: null,
          preferredLanguage: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      setSession: ({ accessToken, patientId, patientName, preferredLanguage }) =>
        set({
          accessToken,
          patientId,
          patientName,
          preferredLanguage: preferredLanguage ?? null,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          accessToken: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "coco-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        patientId: state.patientId,
        patientName: state.patientName,
        preferredLanguage: state.preferredLanguage,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/** @deprecated Use patientId from auth store */
export function useActiveProfileId(): string | null {
  return useAuthStore((s) => s.patientId);
}
