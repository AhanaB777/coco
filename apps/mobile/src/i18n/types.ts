import type { GameType } from "@/types/api";
import type { ReminderType } from "@/types/api";

export interface Translations {
  common: {
    home: string;
    settings: string;
    signOut: string;
    continue: string;
    loading: string;
    friend: string;
  };
  splash: {
    instructions: string;
    badge: string;
    title: string;
    subtitle: string;
    loading: string;
  };
  login: {
    tagline: string;
    signIn: string;
    enterNameSubtitle: string;
    enterPin: string;
    usernameInstructions: string;
    pinInstructions: string;
    pinFor: string;
    namePlaceholder: string;
    nameAccessibilityHint: string;
    nameRequired: string;
    loginError: string;
    changeName: string;
    changeNameAccessibility: string;
    signingIn: string;
    continueHint: string;
  };
  home: {
    instructions: string;
    welcomeBack: string;
    welcomeMessage: string;
    play: string;
    reminders: string;
    progress: string;
    voice: string;
    playHint: string;
    remindersHint: string;
    progressHint: string;
    voiceHint: string;
    settingsHint: string;
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
  };
  settings: {
    instructions: string;
    title: string;
    subtitle: string;
    languageTitle: string;
    languageHint: string;
    assameseFallback: string;
    languageSet: string;
    signOutHint: string;
  };
  play: {
    instructions: string;
    title: string;
    subtitle: string;
    gameHint: string;
  };
  games: Record<GameType, string>;
  gameStub: {
    instructions: string;
    subtitle: string;
    title: string;
    body: string;
    back: string;
    backHint: string;
  };
  reminders: {
    instructions: string;
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    markDone: string;
    markNotDone: string;
  };
  reminderTypes: Record<ReminderType, string>;
  progress: {
    instructions: string;
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    wellDone: string;
    sessions: string;
    avgScore: string;
    dayStreak: string;
    summaryPlayed: string;
    summaryPlayedPlural: string;
    summaryNone: string;
  };
  voice: {
    instructions: string;
    title: string;
    subtitle: string;
    hint: string;
    startListening: string;
    stopListening: string;
    micHint: string;
    idle: string;
    listening: string;
    speaking: string;
    thanks: string;
  };
  pin: {
    delete: string;
    pinLength: string;
  };
  screenHeader: {
    homeHint: string;
  };
}
