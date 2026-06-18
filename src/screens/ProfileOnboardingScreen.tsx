import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';

type ProfileOnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileOnboarding'>;
type ProfileOnboardingScreenRouteProp = RouteProp<RootStackParamList, 'ProfileOnboarding'>;

interface ProfileOnboardingScreenProps {
  navigation: ProfileOnboardingScreenNavigationProp;
  route: ProfileOnboardingScreenRouteProp;
}

export const ProfileOnboardingScreen: React.FC<ProfileOnboardingScreenProps> = ({
  navigation,
  route,
}) => {
  const { phoneNumber } = route.params;
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  // Field validation errors
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Availability / Strength indicators
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const usernameTimerRef = useRef<any>(null);

  // Real-time username availability check (debounced)
  useEffect(() => {
    if (usernameTimerRef.current) {
      clearTimeout(usernameTimerRef.current);
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      setUsernameStatus('');
      setUsernameError('');
      return;
    }

    // Validate characters
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      setUsernameError('Username can only contain letters, numbers, and underscores.');
      setUsernameStatus('');
      return;
    }

    setUsernameError('');
    setIsCheckingUsername(true);

    usernameTimerRef.current = setTimeout(async () => {
      try {
        const available = await authService.checkUsernameAvailable(cleanUsername);
        setUsernameStatus(available ? 'available' : 'taken');
        if (!available) {
          setUsernameError('This username is already taken.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    };
  }, [username]);

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: theme.textMuted, score: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', color: theme.error, score };
    if (score <= 3) return { label: 'Medium', color: theme.primary, score };
    return { label: 'Strong', color: theme.success, score };
  };

  const strength = getPasswordStrength();

  const handleOnboardingComplete = async () => {
    let hasError = false;

    // Validate required fields
    if (!fullName.trim()) {
      setNameError('Full name is required.');
      hasError = true;
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername) {
      setUsernameError('Username is required.');
      hasError = true;
    } else if (usernameStatus === 'taken') {
      setUsernameError('This username is already taken.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await authService.completeRegistration({
        phoneNumber,
        username: `@${cleanUsername}`,
        name: fullName.trim(),
        password,
      });

      setIsLoading(false);

      if (response.success && response.data && response.data.user) {
        navigation.navigate('ProfileSetup', { user: response.data.user });
      }
    } catch (err: any) {
      setIsLoading(false);
      setPasswordError(err.message || 'Registration failed. Please check details and try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Profile Details</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Set up your credentials to complete account creation.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (nameError) setNameError('');
            }}
            iconName="person-outline"
            error={nameError}
            autoCapitalize="words"
          />

          <CustomInput
            label="Username"
            placeholder="john_doe"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            iconName="at-outline"
            error={usernameError}
            helperText={
              isCheckingUsername
                ? 'Checking username availability...'
                : usernameStatus === 'available'
                ? 'Username is available'
                : ''
            }
          />

          <CustomInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            iconName="lock-closed-outline"
            isPassword
            error={passwordError}
          />

          {/* Password Strength indicator bar */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={[styles.strengthLabel, { color: theme.textSecondary }]}>
                  Password Strength:{' '}
                </Text>
                <Text style={[styles.strengthValue, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
              <View style={[styles.barBackground, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <CustomButton
            title="Complete Registration"
            onPress={handleOnboardingComplete}
            style={styles.button}
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} message="Creating account..." />
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
  },
  strengthContainer: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  strengthHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  strengthLabel: {
    ...TYPOGRAPHY.bodySmall,
  },
  strengthValue: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  barBackground: {
    height: 6,
    borderRadius: BORDER_RADIUS.round,
    width: '100%',
  },
  barFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  button: {
    marginTop: SPACING.lg,
  },
});
export default ProfileOnboardingScreen;
