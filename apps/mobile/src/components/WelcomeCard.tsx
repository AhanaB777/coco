import { StyleSheet, Text, View } from "react-native";

import { theme, wovenBorder } from "@/theme";

interface WelcomeCardProps {
  name: string;
  message?: string;
}

export function WelcomeCard({ name, message }: WelcomeCardProps) {
  const greeting = getGreeting();

  return (
    <View style={styles.card}>
      <View style={styles.goldAccent} />
      <Text style={styles.overline} allowFontScaling>
        {greeting}
      </Text>
      <Text style={styles.name} allowFontScaling accessibilityRole="header">
        {name}
      </Text>
      {message ? (
        <Text style={styles.message} allowFontScaling>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const styles = StyleSheet.create({
  card: {
    ...wovenBorder,
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.goldBorder,
    borderRadius: theme.border.radius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  goldAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: theme.colors.gold,
  },
  overline: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  name: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
});
