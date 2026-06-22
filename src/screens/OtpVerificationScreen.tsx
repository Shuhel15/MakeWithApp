import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { OtpInput } from '../components/OtpInput';
import { CustomButton } from '../components/CustomButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';

type OtpVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OtpVerification'>;
type OtpVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;

interface OtpVerificationScreenProps {
  navigation: OtpVerificationScreenNavigationProp;
  route: OtpVerificationScreenRouteProp;
}

const TIMER_INITIAL_SECONDS = 59;

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { phoneNumber, devOtp } = route.params;
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(TIMER_INITIAL_SECONDS);
  const [error, setError] = useState('');
  const [isOtpError, setIsOtpError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Timer countdown hook
  useEffect(() => {
    if (timer <= 0) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode;
    setError('');
    setIsOtpError(false);

    if (!code || code.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      setIsOtpError(true);
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOtp(phoneNumber, code);
      setIsLoading(false);
      navigation.navigate('ProfileOnboarding', { phoneNumber });
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Incorrect OTP code. Please check and try again.');
      setIsOtpError(true);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsOtpError(false);
    setOtpCode('');
    setIsLoading(true);

    try {
      await authService.resendOtp(phoneNumber);
      setIsLoading(false);
      setTimer(TIMER_INITIAL_SECONDS);
      Alert.alert('Success', 'A new OTP has been sent successfully.');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Unable to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Verify Phone</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter the 6-digit code sent to{' '}
            <Text style={{ fontWeight: '600', color: theme.primary }}>{phoneNumber}</Text>
          </Text>
          {devOtp && (
            <View style={[styles.devOtpContainer, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}>
              <Text style={[styles.devOtpText, { color: theme.primary }]}>
                [Dev Mode] Verification Code: <Text style={{ fontWeight: 'bold' }}>{devOtp}</Text>
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <OtpInput
            length={6}
            onCodeFilled={(code) => {
              setOtpCode(code);
              handleVerify(code);
            }}
            error={isOtpError}
          />

          {error ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          ) : null}

          <View style={styles.timerContainer}>
            {timer > 0 ? (
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>
                Resend code in{' '}
                <Text style={{ color: theme.primary, fontWeight: '600' }}>
                  {formatTime(timer)}
                </Text>
              </Text>
            ) : (
              <View style={styles.resendWrapper}>
                <Text style={[styles.timerText, { color: theme.textMuted }]}>
                  Didn't receive the code?{' '}
                </Text>
                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                  <Text style={[styles.resendText, { color: theme.primary }]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <CustomButton
            title="Verify & Continue"
            onPress={() => handleVerify()}
            style={styles.button}
            disabled={otpCode.length < 6}
          />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.primary }]}>
              Back to Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} message="Verifying code..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    textAlign: 'center',
    paddingHorizontal: SPACING.sm,
  },
  formContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  timerText: {
    ...TYPOGRAPHY.bodyMedium,
  },
  resendWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  button: {
    marginTop: SPACING.xs,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  linkText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  devOtpContainer: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  devOtpText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '500',
  },
});
export default OtpVerificationScreen;
