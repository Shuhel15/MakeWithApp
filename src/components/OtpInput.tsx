import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';

interface OtpInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onCodeFilled,
  error = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Clear code when error state shifts or resets
    if (error) {
      setOtp(Array(length).fill(''));
      inputs.current[0]?.focus();
    }
  }, [error, length]);

  const handleChangeText = (text: string, index: number) => {
    // Strip and allow only digits
    const cleanedText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanedText.length > 1) {
      // Handle paste scenario
      const pasteData = cleanedText.slice(0, length).split('');
      for (let i = 0; i < length; i++) {
        newOtp[i] = pasteData[i] || '';
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasteData.length, length - 1);
      inputs.current[focusIndex]?.focus();
      onCodeFilled(newOtp.join(''));
      return;
    }

    newOtp[index] = cleanedText;
    setOtp(newOtp);

    // Call callback if code is complete
    const completeCode = newOtp.join('');
    if (completeCode.length === length) {
      onCodeFilled(completeCode);
    }

    // Auto-focus next input
    if (cleanedText !== '' && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Shift focus to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: error
                ? theme.error
                : digit
                ? theme.primary
                : theme.border,
              color: theme.text,
            },
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
          placeholder="•"
          placeholderTextColor={theme.placeholder}
          accessibilityLabel={`Digit ${index + 1}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: SPACING.md,
  },
  input: {
    width: 48,
    height: 54,
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.sm,
    textAlign: 'center',
    ...TYPOGRAPHY.h2,
    fontWeight: '700',
  },
});
