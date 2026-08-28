import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CocoMark } from "@/components/CocoMark";
import { ScreenLayout } from "@/components/ScreenLayout";
import { TopAccent } from "@/components/TopAccent";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme";

export const SPLASH_INSTRUCTIONS =
  "Welcome to Coco. Your memory care companion for North East India.";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const activeProfileId = useAuthStore((state) => state.activeProfileId);

  useSpeakOnMount(SPLASH_INSTRUCTIONS);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeProfileId) {
        navigation.replace("Home");
      } else {
        navigation.replace("LoginProfile");
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [activeProfileId, navigation]);

  return (
    <ScreenLayout decorated={false}>
      <TopAccent />
      <View style={styles.container}>
        <View style={styles.logoPedestal}>
          <CocoMark size="lg" />
        </View>
        <Text style={styles.badge} allowFontScaling>
          Coco
        </Text>
        <Text style={styles.title} allowFontScaling accessibilityRole="header">
          Memory care companion
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Cognitive games and gentle reminders for families across the North East
        </Text>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
          accessibilityLabel="Loading"
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  logoPedestal: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.goldBorder,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    ...theme.typography.overline,
    color: theme.colors.gold,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: "center",
    maxWidth: 340,
  },
  loader: {
    marginTop: theme.spacing.lg,
  },
});
