import { useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { theme } from "@/theme";

type BigButtonVariant = "primary" | "outline" | "accent";

interface BigButtonProps {
  label: string;
  onPress: () => void;
  variant?: BigButtonVariant;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function BigButton({
  label,
  onPress,
  variant = "primary",
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
}: BigButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) return;
      Animated.timing(scale, {
        toValue: theme.motion.pressScale,
        duration: theme.motion.pressDuration,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: theme.motion.pressDuration,
      useNativeDriver: true,
    }).start();
  };

  const variantStyle =
    variant === "outline"
      ? styles.outline
      : variant === "accent"
        ? styles.accent
        : styles.primary;

  const textStyle =
    variant === "outline" ? styles.outlineText : styles.filledText;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.button,
          variantStyle,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.label, textStyle]} allowFontScaling>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: theme.touch.minTarget,
    minWidth: theme.touch.minTarget,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.border.radius,
    borderWidth: theme.border.width,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  outline: {
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...theme.typography.label,
    textAlign: "center",
  },
  filledText: {
    color: theme.colors.onPrimary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
});
