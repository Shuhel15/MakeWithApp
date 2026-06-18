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
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';

type PasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Password'>;
type PasswordScreenRouteProp = RouteProp<RootStackParamList, 'Password'>;

interface PasswordScreenProps {
  navigation: PasswordScreenNavigationProp;
  route: PasswordScreenRouteProp;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ navigation, route }) => {
  const { identifier } = route.params;
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({
        identifier,
        password,
      });
      setIsLoading(false);
      
      // Navigate to Home screen on success
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Incorrect password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset instructions have been simulated. In production, this would trigger an OTP verification or reset link.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Enter Password</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Logging in as <Text style={{ fontWeight: '600', color: theme.primary }}>{identifier}</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            iconName="lock-closed-outline"
            isPassword
            error={error}
          />

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotContainer}
            activeOpacity={0.7}
          >
            <Text style={[styles.forgotText, { color: theme.primary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Log In"
            onPress={handleLogin}
            style={styles.button}
          />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.primary }]}>
              Back to change account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} message="Logging in..." />
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
  },
  formContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  forgotText: {
    ...TYPOGRAPHY.bodySmall,
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
});
export default PasswordScreen;
