import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { CocoMark } from "@/components/CocoMark";
import { ProfilePhotoTile } from "@/components/ProfilePhotoTile";
import { ScreenLayout } from "@/components/ScreenLayout";
import { getAllProfiles } from "@/db/database";
import type { PatientProfile } from "@/db/schema";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import type { RootStackParamList } from "@/navigation/types";
import { theme } from "@/theme";

export const LOGIN_PROFILE_INSTRUCTIONS =
  "Tap your photo to sign in. Choose the profile that belongs to you.";

type Props = NativeStackScreenProps<RootStackParamList, "LoginProfile">;

export function LoginProfileScreen({ navigation }: Props) {
  const [profiles, setProfiles] = useState<PatientProfile[]>([]);

  useSpeakOnMount(LOGIN_PROFILE_INSTRUCTIONS);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllProfiles()
        .then((result) => {
          if (active) setProfiles(result);
        })
        .catch((error) => console.error("Failed to load profiles", error));
      return () => {
        active = false;
      };
    }, [])
  );

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

      <Text style={styles.title} allowFontScaling accessibilityRole="header">
        Who are you?
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        Tap your photo to continue
      </Text>

      <View style={styles.grid}>
        {profiles.map((profile, index) => (
          <View key={profile.id} style={styles.gridItem}>
            <ProfilePhotoTile
              displayName={profile.display_name}
              photoUri={profile.photo_uri}
              colorIndex={index}
              onPress={() =>
                navigation.navigate("LoginPin", { profileId: profile.id })
              }
            />
          </View>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  logoPedestal: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.goldBorder,
    boxShadow: "0px 4px 8px rgba(8, 79, 79, 0.12)",
  },
  tagline: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    fontSize: 14,
    letterSpacing: 1.5,
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
    marginBottom: theme.spacing.md,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
    alignContent: "flex-start",
  },
  gridItem: {
    width: "47%",
  },
});
