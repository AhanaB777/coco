import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

/**
 * Coco NER design tokens — warm handloom palette rooted in North East India:
 * hill-forest greens, Brahmaputra teal, Muga silk gold thread accents.
 * High contrast maintained for elderly / dementia-friendly use.
 */
export const theme = {
  colors: {
    background: "#FFFBF5",
    foreground: "#1C2B21",
    primary: "#0B6E6E",
    primaryDark: "#084F4F",
    onPrimary: "#FFFFFF",
    accent: "#2F6B3A",
    onAccent: "#FFFFFF",
    gold: "#9A7B2F",
    goldLight: "#F5EDD6",
    goldBorder: "#C9A84C",
    border: "#C4A882",
    borderAccent: "#0B6E6E",
    muted: "#4A5C50",
    surface: "#FFFFFF",
    surfaceWarm: "#F7F0E4",
    destructive: "#B91C1C",
    warning: "#B45309",
    // Per-tile accents on Home / Play
    tilePlay: "#0B6E6E",
    tileReminders: "#9A7B2F",
    tileProgress: "#2F6B3A",
    tileVoice: "#5B4A8A",
    tilePlayBg: "#E8F5F5",
    tileRemindersBg: "#FBF5E6",
    tileProgressBg: "#EDF5EE",
    tileVoiceBg: "#F0ECF5",
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  typography: {
    body: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: "AtkinsonHyperlegible_400Regular",
    } satisfies TextStyle,
    bodyBold: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: "AtkinsonHyperlegible_700Bold",
      fontWeight: "700",
    } satisfies TextStyle,
    title: {
      fontSize: 28,
      lineHeight: 36,
      fontFamily: "AtkinsonHyperlegible_700Bold",
      fontWeight: "700",
    } satisfies TextStyle,
    headline: {
      fontSize: 32,
      lineHeight: 40,
      fontFamily: "AtkinsonHyperlegible_700Bold",
      fontWeight: "700",
    } satisfies TextStyle,
    label: {
      fontSize: 22,
      lineHeight: 30,
      fontFamily: "AtkinsonHyperlegible_700Bold",
      fontWeight: "600",
    } satisfies TextStyle,
    caption: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: "AtkinsonHyperlegible_400Regular",
    } satisfies TextStyle,
    overline: {
      fontSize: 16,
      lineHeight: 22,
      fontFamily: "AtkinsonHyperlegible_700Bold",
      fontWeight: "700",
      letterSpacing: 2,
      textTransform: "uppercase",
    } satisfies TextStyle,
  },
  touch: {
    minTarget: 64,
    tileMinHeight: 140,
    gap: 16,
  },
  border: {
    radius: 14,
    width: 2,
  },
  motion: {
    pressDuration: 150,
    pressScale: 0.97,
  },
  /** Avatar fallback colours — earthy NER landscape tones */
  profileAvatarColors: [
    "#0B6E6E",
    "#2F6B3A",
    "#7A5C1E",
    "#5B4A8A",
    "#8B3A3A",
  ],
} as const;

export type Theme = typeof theme;

/** Handloom-inspired double-thread border */
export const wovenBorder: ViewStyle = {
  borderWidth: theme.border.width,
  borderColor: theme.colors.goldBorder,
  borderRadius: theme.border.radius,
  borderStyle: "solid",
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  card: {
    ...wovenBorder,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderColor: theme.colors.borderAccent,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.foreground,
  },
  titleText: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
  mutedText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
});
