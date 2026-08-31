import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppIcon } from "@/components/AppIcon";
import { BigButton } from "@/components/BigButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLayout } from "@/components/ScreenLayout";
import {
  NARRATOR_LANGUAGES,
  type NarratorLanguage,
  normalizeNarratorLanguageCode,
} from "@/constants/narratorLanguages";
import { useSpeakOnMount } from "@/hooks/useSpeakOnMount";
import { useTranslation } from "@/i18n";
import type { RootStackParamList } from "@/navigation/types";
import { speakInstructions } from "@/services/speech";
import { useAuthStore } from "@/stores/authStore";
import { surfaceCard, theme } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const selectedCode = normalizeNarratorLanguageCode(
    useAuthStore((state) => state.preferredLanguage)
  );
  const setPreferredLanguage = useAuthStore((state) => state.setPreferredLanguage);
  const signOut = useAuthStore((state) => state.signOut);

  useSpeakOnMount(t("settings.instructions"));

  const handleSelectLanguage = (language: NarratorLanguage) => {
    setPreferredLanguage(language.code);
    void speakInstructions(t("settings.languageSet"), {
      languageCode: language.code,
    });
  };

  const handleSignOut = () => {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginPin" }],
    });
  };

  return (
    <ScreenLayout scrollable>
      <ScreenHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        onHomePress={() => navigation.navigate("Home")}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle} allowFontScaling accessibilityRole="header">
          {t("settings.languageTitle")}
        </Text>
        <Text style={styles.sectionHint} allowFontScaling>
          {t("settings.languageHint")}
        </Text>

        <View style={styles.languageList}>
          {NARRATOR_LANGUAGES.map((language) => {
            const isSelected = selectedCode === language.code;

            return (
              <Pressable
                key={language.code}
                onPress={() => handleSelectLanguage(language)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${language.label}, ${language.nativeLabel}`}
                style={({ pressed }) => [
                  styles.languageRow,
                  isSelected && styles.languageRowSelected,
                  pressed && styles.languageRowPressed,
                ]}
              >
                <View style={styles.languageText}>
                  <Text style={styles.languageLabel} allowFontScaling>
                    {language.label}
                  </Text>
                  <Text style={styles.languageNative} allowFontScaling>
                    {language.nativeLabel}
                  </Text>
                  {language.code === "as" ? (
                    <Text style={styles.fallbackNote} allowFontScaling>
                      {t("settings.assameseFallback")}
                    </Text>
                  ) : null}
                </View>

                {isSelected ? (
                  <AppIcon
                    name="CheckCircle"
                    size={32}
                    color={theme.colors.tilePlay}
                    weight="fill"
                  />
                ) : (
                  <View style={styles.unselectedMarker} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <BigButton
        label={t("common.signOut")}
        onPress={handleSignOut}
        variant="outline"
        accessibilityHint={t("settings.signOutHint")}
        style={styles.signOutButton}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.label,
    color: theme.colors.foreground,
  },
  sectionHint: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  languageList: {
    gap: theme.touch.gap,
    marginTop: theme.spacing.xs,
  },
  languageRow: {
    ...surfaceCard({ elevated: false }),
    minHeight: theme.touch.minTarget,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    borderColor: theme.colors.borderSubtle,
  },
  languageRowSelected: {
    backgroundColor: theme.colors.tilePlayBg,
    borderColor: theme.colors.tilePlay,
  },
  languageRowPressed: {
    opacity: 0.94,
  },
  languageText: {
    flex: 1,
    gap: 4,
  },
  languageLabel: {
    ...theme.typography.label,
    color: theme.colors.foreground,
  },
  languageNative: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  fallbackNote: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: 2,
  },
  unselectedMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: theme.border.subtleWidth + 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceElevated,
  },
  signOutButton: {
    marginBottom: theme.spacing.md,
  },
});
