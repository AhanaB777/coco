import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface PinPadProps {
  value: string;
  maxLength?: number;
  onChange: (next: string) => void;
  onComplete?: (pin: string) => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PinPad({
  value,
  maxLength = 4,
  onChange,
  onComplete,
}: PinPadProps) {
  const handleKey = (key: string) => {
    if (key === "back") {
      onChange(value.slice(0, -1));
      return;
    }
    if (!key || value.length >= maxLength) return;

    const next = `${value}${key}`;
    onChange(next);
    if (next.length === maxLength) {
      onComplete?.(next);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dots} accessibilityLabel={`PIN length ${value.length} of ${maxLength}`}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index < value.length && styles.dotFilled]}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {KEYS.map((key, index) => {
          if (key === "") {
            return <View key={`spacer-${index}`} style={styles.keySpacer} />;
          }

          const isBack = key === "back";
          const label = isBack ? "Delete" : key;

          return (
            <Pressable
              key={key}
              onPress={() => handleKey(key)}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.key,
                pressed && styles.keyPressed,
              ]}
            >
              {isBack ? (
                <Ionicons
                  name="backspace-outline"
                  size={32}
                  color={theme.colors.foreground}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              ) : (
                <Text style={styles.keyText} allowFontScaling>
                  {key}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: theme.border.width,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  dotFilled: {
    backgroundColor: theme.colors.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  key: {
    width: "30%",
    minHeight: theme.touch.minTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.border.radius,
    borderWidth: theme.border.width,
    borderColor: theme.colors.goldBorder,
    backgroundColor: theme.colors.surfaceWarm,
  },
  keySpacer: {
    width: "30%",
    minHeight: theme.touch.minTarget,
  },
  keyPressed: {
    backgroundColor: theme.colors.background,
  },
  keyText: {
    ...theme.typography.title,
    color: theme.colors.foreground,
  },
});
