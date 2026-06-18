import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  isPassword?: boolean;
  helperText?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  iconName,
  isPassword,
  helperText,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground,
            borderColor: hasError
              ? theme.error
              : isFocused
              ? theme.primary
              : theme.border,
          },
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={20}
            color={hasError ? theme.error : isFocused ? theme.primary : theme.textMuted}
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            style,
          ]}
          placeholderTextColor={theme.placeholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError ? (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: theme.textMuted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    ...TYPOGRAPHY.bodyMedium,
    paddingVertical: 0,
  },
  iconRight: {
    padding: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  helperText: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
