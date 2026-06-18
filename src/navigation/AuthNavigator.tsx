import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/auth';

// Import Screens from screens directory
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import PasswordScreen from '../screens/PasswordScreen';
import ProfileOnboardingScreen from '../screens/ProfileOnboardingScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import DummyHomeScreen from '../screens/DummyHomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Password" component={PasswordScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ProfileOnboarding" component={ProfileOnboardingScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Home" component={DummyHomeScreen} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
