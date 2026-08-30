import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

/** Soft hill-sky gradient — Brahmaputra mist at dawn, very subtle */
export function DecorativeBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.noPointer]}>
      <LinearGradient
        colors={[
          theme.colors.background,
          theme.colors.surfaceWarm,
          theme.colors.tilePlayBg,
        ]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  noPointer: {
    pointerEvents: "none",
  },
  orbTop: {
    position: "absolute",
    top: 40,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(11, 110, 110, 0.05)",
  },
  orbBottom: {
    position: "absolute",
    bottom: 100,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(154, 123, 47, 0.05)",
  },
});
