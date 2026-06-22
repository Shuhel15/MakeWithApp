import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, useColorScheme } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Please wait...',
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.glassBackground }]}>
      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    minWidth: 160,
  },
  text: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
