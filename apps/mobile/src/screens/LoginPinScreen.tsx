import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PinPad } from "@/components/PinPad";
import { ScreenLayout } from "@/components/ScreenLayout";
import { getProfileById } from "@/db/database";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme";

export const LOGIN_PIN_INSTRUCTIONS =
  "Enter your four digit PIN using the number pad.";

type Props = NativeStackScreenProps<RootStackParamList, "LoginPin">;

export function LoginPinScreen({ navigation, route }: Props) {
  const { profileId } = route.params;
  const [pin, setPin] = useState("");
  const setActiveProfile = useAuthStore((state) => state.setActiveProfile);

  const profile = useMemo(() => getProfileById(profileId), [profileId]);

  useSpeakOnMount(
    profile
      ? `Enter PIN for ${profile.display_name}. ${LOGIN_PIN_INSTRUCTIONS}`
      : LOGIN_PIN_INSTRUCTIONS
  );

  const handleComplete = (enteredPin: string) => {
    if (!profile) {
      Alert.alert("Profile not found", "Please go back and choose a profile.");
      return;
    }

    // TODO: [backend teammate] hash and verify PIN via API instead of plain-text compare
    if (enteredPin === (profile.pin ?? "")) {
      setActiveProfile(profile.id, profile.display_name);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      return;
    }

    Alert.alert("Incorrect PIN", "Please try again.");
    setPin("");
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title} allowFontScaling accessibilityRole="header">
          Enter PIN
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          {profile?.display_name ?? "Patient"}
        </Text>

        <PinPad value={pin} onChange={setPin} onComplete={handleComplete} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
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
  },
});
