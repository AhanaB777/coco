import { create } from "zustand";

interface AuthState {
  activeProfileId: string | null;
  activeProfileName: string | null;
  setActiveProfile: (profileId: string, displayName: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  activeProfileId: null,
  activeProfileName: null,
  setActiveProfile: (profileId, displayName) =>
    set({ activeProfileId: profileId, activeProfileName: displayName }),
  clearSession: () =>
    set({ activeProfileId: null, activeProfileName: null }),
}));
