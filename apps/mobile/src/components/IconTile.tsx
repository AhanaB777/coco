import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme, wovenBorder } from "@/theme";

interface IconTileProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  flex?: number;
  accentColor?: string;
  backgroundColor?: string;
}

export function IconTile({
  label,
  iconName,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  flex = 1,
  accentColor = theme.colors.primary,
  backgroundColor = theme.colors.surface,
}: IconTileProps) {
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

  return (
    <Animated.View style={[styles.wrapper, { flex, transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        style={({ pressed }) => [
          styles.tile,
          { backgroundColor, borderColor: accentColor },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
          <Ionicons
            name={iconName}
            size={40}
            color={theme.colors.onPrimary}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>
        <Text style={[styles.label, { color: theme.colors.foreground }]} allowFontScaling>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: theme.touch.tileMinHeight,
  },
  tile: {
    flex: 1,
    ...wovenBorder,
    minHeight: theme.touch.tileMinHeight,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.goldBorder,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...theme.typography.label,
    textAlign: "center",
  },
});
