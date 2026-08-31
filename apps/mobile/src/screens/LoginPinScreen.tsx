import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CocoMark } from "@/components/CocoMark";
import { PinPad } from "@/components/PinPad";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { fetchAuthMe, patientLogin } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { theme, logoPedestal } from "@/theme";

export const LOGIN_PIN_INSTRUCTIONS =
  "Enter your four digit PIN using the number pad.";

type Props = NativeStackScreenProps<RootStackParamList, "LoginPin">;

export function LoginPinScreen({ navigation }: Props) {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const patientId = useAuthStore((state) => state.patientId);
  const patientName = useAuthStore((state) => state.patientName);
  const setSession = useAuthStore((state) => state.setSession);

  const displayName = patientName ?? "Welcome";

  useSpeakOnMount(
    patientName
      ? `Enter PIN for ${patientName}. ${LOGIN_PIN_INSTRUCTIONS}`
      : LOGIN_PIN_INSTRUCTIONS
  );

  const handleComplete = async (enteredPin: string) => {
    if (!patientId) {
      Alert.alert(
        "Setup needed",
        "This device is not linked to a patient account yet."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const token = await patientLogin({
        patient_id: patientId,
        pin: enteredPin,
      });

      useAuthStore.setState({ accessToken: token.access_token });

      const me = await fetchAuthMe();
      const patient = me.patient;

      if (!patient) {
        throw new Error("Patient profile not found");
      }

      setSession({
        accessToken: token.access_token,
        patientId: patient.id,
        patientName: patient.full_name,
        preferredLanguage: patient.preferred_language,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch {
      setErrorMessage("Incorrect PIN. Please try again.");
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.hero}>
        <View style={styles.logoPedestal}>
          <CocoMark size="sm" />
        </View>
        <Text style={styles.tagline} allowFontScaling>
          North East India · Memory care
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title} allowFontScaling accessibilityRole="header">
          Enter PIN
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          {displayName}
        </Text>

        {errorMessage ? (
          <Text
            style={styles.error}
            allowFontScaling
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {errorMessage}
          </Text>
        ) : null}

        {isSubmitting ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            accessibilityLabel="Signing in"
            style={styles.loader}
          />
        ) : (
          <PinPad
            value={pin}
            onChange={setPin}
            onComplete={handleComplete}
          />
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  logoPedestal: {
    ...logoPedestal,
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  tagline: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    fontSize: 14,
    letterSpacing: 1.5,
  },
  container: {
    flex: 1,
    paddingTop: theme.spacing.sm,
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
  error: {
    ...theme.typography.body,
    color: theme.colors.destructive,
    textAlign: "center",
    fontWeight: "600",
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
});
