import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, StyleSheet, View } from 'react-native';
import { theme } from '@/theme';

interface EncouragementBannerProps {
  /** null/undefined = hidden. Any change to a non-null value re-triggers the animation. */
  message: string | null;
  tone?: 'gentle' | 'celebration';
  durationMs?: number;
  overlay?: boolean;
  onHide?: () => void;
}

export function EncouragementBanner({
  message,
  tone = 'gentle',
  durationMs = 2000,
  overlay = false,
  onHide,
}: EncouragementBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!message) return;

    opacity.setValue(0);
    translateY.setValue(-12);

    const showAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]);

    showAnim.start();

    const hideTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, durationMs);

    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (!message) return null;

  const bg = tone === 'celebration' ? theme.colors.tileProgressBg : theme.colors.goldLight;
  const fg = tone === 'celebration' ? theme.colors.tileProgress : theme.colors.warning;

  const content = (
    <Animated.View
      style={[
        styles.banner,
        overlay && styles.overlayBanner,
        { backgroundColor: bg, opacity, transform: [{ translateY }] },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, { color: fg }]}>{message}</Text>
    </Animated.View>
  );

  if (!overlay) return content;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onHide}>
      <View style={styles.overlay} pointerEvents="box-none">
        {content}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'center',
    marginVertical: theme.spacing.xs,
    marginTop: theme.spacing.xl,
    borderWidth: theme.border.subtleWidth,
    borderColor: theme.colors.borderSubtle,
    ...theme.elevation.md,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(30, 45, 36, 0.22)',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  overlayBanner: {
    width: '100%',
    maxWidth: 360,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginVertical: 0,
  },
  text: {
    ...theme.typography.bodyBold,
    textAlign: 'center',
  },
});
