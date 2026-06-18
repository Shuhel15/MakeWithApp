import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const buttonDisabled = disabled || isLoading;

  const getOutlineStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: theme.primary,
        backgroundColor: 'transparent',
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: theme.primaryLight,
      };
    }
    if (variant === 'text') {
      return {
        backgroundColor: 'transparent',
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (buttonDisabled) return theme.textMuted;
    if (variant === 'primary') return '#FFFFFF'; // Dark/Light primary text is white for visual consistency on gradient/colored buttons
    if (variant === 'outline' || variant === 'text') return theme.primary;
    if (variant === 'secondary') return theme.primary;
    return theme.text;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : theme.primary}
        />
      );
    }
    return (
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );
  };

  if (variant === 'primary' && !buttonDisabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={buttonDisabled}
        activeOpacity={0.8}
        style={[styles.container, style]}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#818CF8', '#C084FC'] : ['#6366F1', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={buttonDisabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        getOutlineStyle(),
        buttonDisabled && {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View style={styles.contentWrapper}>{renderContent()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.xs,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    ...TYPOGRAPHY.button,
  },
});
