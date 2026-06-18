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
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setError('');
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setError('Please enter your username or phone number.');
      return;
    }

    // Basic format validations
    const isPhone = /^\+?[1-9]\d{1,14}$/.test(trimmedIdentifier);
    const isUsername = /^[a-zA-Z0-9_@]+$/.test(trimmedIdentifier);

    if (!isPhone && !isUsername) {
      setError('Please enter a valid phone number (e.g. +919876543210) or username.');
      return;
    }

    // Normalize phone number to E.164 if they entered digits starting with no +
    let finalIdentifier = trimmedIdentifier;
    if (isPhone && !trimmedIdentifier.startsWith('+')) {
      // Assuming a default country prefix like +91 if they enter 10 digits
      if (trimmedIdentifier.length === 10) {
        finalIdentifier = `+91${trimmedIdentifier}`;
      } else {
        finalIdentifier = `+${trimmedIdentifier}`;
      }
    }

    setIsLoading(true);

    try {
      const exists = await authService.checkUserExists(finalIdentifier);
      setIsLoading(false);
      
      if (exists) {
        navigation.navigate('Password', { identifier: finalIdentifier });
      } else {
        setError('Account not found. Please verify details or sign up.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Welcome to MakeWith</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover and share products with your friends.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Username or Phone Number"
            placeholder="@username or +919876543210"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (error) setError('');
            }}
            iconName="person-outline"
            error={error}
            keyboardType={/^\d+$/.test(identifier) ? 'phone-pad' : 'default'}
          />

          <CustomButton
            title="Continue"
            onPress={handleNext}
            style={styles.button}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} message="Verifying account..." />
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
    marginBottom: SPACING.huge,
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
export default LoginScreen;
