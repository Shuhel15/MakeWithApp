import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

type SignupTab = 'phone' | 'gmail';

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState<SignupTab>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setError('');

    if (activeTab === 'phone') {
      const trimmedPhone = phoneNumber.trim();
      if (!trimmedPhone) {
        setError('Phone number is required.');
        return;
      }

      // E.164 phone validation regex
      // Supports formats like +919876543210
      const phoneRegex = /^\+?[1-9]\d{6,14}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        setError('Phone number must be valid and include country code (e.g. +919876543210).');
        return;
      }

      // Normalize phone number format (ensure + prefix)
      let formattedPhone = trimmedPhone;
      if (!trimmedPhone.startsWith('+')) {
        if (trimmedPhone.length === 10) {
          formattedPhone = `+91${trimmedPhone}`;
        } else {
          formattedPhone = `+${trimmedPhone}`;
        }
      }

      setIsLoading(true);
      try {
        const response = await authService.sendOtp(formattedPhone);
        setIsLoading(false);
        const devOtp = (response as any).devOtp;
        navigation.navigate('OtpVerification', { phoneNumber: formattedPhone, devOtp });
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    } else {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError('Email address is required.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setError('Please enter a valid email address (e.g. name@gmail.com).');
        return;
      }

      // Since the backend SMS route requires a phone number, we simulate Gmail registration
      // by asking for a dummy phone number or mapping it directly in mock mode.
      // To satisfy both flows in a production app, we will use a simulated phone number mapped to the email.
      // E.g., generate a deterministic phone number prefix based on the email, or just ask them for verification.
      // Let's prompt a simple message or map to phone OTP verification.
      // For visual testing we map it to a deterministic dummy number +15550000000.
      const simulatedPhone = `+1555${Math.abs(trimmedEmail.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString().slice(0, 7).padEnd(7, '0')}`;

      setIsLoading(true);
      try {
        const response = await authService.sendOtp(simulatedPhone);
        setIsLoading(false);
        const devOtp = (response as any).devOtp;
        navigation.navigate('OtpVerification', { phoneNumber: simulatedPhone, devOtp });
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'Failed to initialize Gmail signup. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join MakeWith to start discovering products with your friends.
          </Text>
        </View>

        {/* Custom Tab Switcher */}
        <View style={[styles.tabContainer, { backgroundColor: theme.inputBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'phone' && [styles.activeTab, { backgroundColor: theme.card }],
            ]}
            onPress={() => {
              setActiveTab('phone');
              setError('');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'phone' ? theme.text : theme.textMuted },
                activeTab === 'phone' && styles.activeTabText,
              ]}
            >
              Phone Number
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'gmail' && [styles.activeTab, { backgroundColor: theme.card }],
            ]}
            onPress={() => {
              setActiveTab('gmail');
              setError('');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'gmail' ? theme.text : theme.textMuted },
                activeTab === 'gmail' && styles.activeTabText,
              ]}
            >
              Gmail
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {activeTab === 'phone' ? (
            <CustomInput
              label="Phone Number"
              placeholder="+919876543210"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (error) setError('');
              }}
              iconName="call-outline"
              error={error}
              keyboardType="phone-pad"
              helperText="We will send you a 6-digit verification code."
            />
          ) : (
            <CustomInput
              label="Gmail Address"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              iconName="mail-outline"
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="We will simulate a secure email verification code."
            />
          )}

          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} message="Sending verification code..." />
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
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.bodyMedium,
  },
  linkText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
});
export default SignupScreen;
