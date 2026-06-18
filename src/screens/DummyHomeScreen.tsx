import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/auth';
import { User } from '../types/user';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const DummyHomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        // Force back to login if session fetch fails
        handleNavigationToLogin();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleNavigationToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsLoggingOut(false);
      handleNavigationToLogin();
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Logout failed', error);
      handleNavigationToLogin(); // Fallback anyway
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <LoadingOverlay visible={true} message="Loading profile..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>MakeWith</Text>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={[styles.logoutButton, { backgroundColor: theme.inputBackground }]}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.inputBackground }]}>
              <Ionicons name="person" size={48} color={theme.textMuted} />
            </View>
          )}

          <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'Guest User'}</Text>
          <Text style={[styles.username, { color: theme.primary }]}>{user?.username || '@guest'}</Text>
          <Text style={[styles.phone, { color: theme.textSecondary }]}>{user?.phoneNumber}</Text>

          <View style={[styles.badgeContainer, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {user?.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>

        <View style={[styles.welcomeCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
          <Ionicons name="sparkles-outline" size={28} color={theme.accent} style={styles.welcomeIcon} />
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>Welcome to your Feed!</Text>
          <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
            This is a dummy home screen placeholder. In the next phase, you'll be able to discover products, browse lists, and interact with friends.
          </Text>
        </View>
      </View>
      <LoadingOverlay visible={isLoggingOut} message="Logging out..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontWeight: '800',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  username: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  phone: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  badgeContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  welcomeCard: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  welcomeIcon: {
    marginBottom: SPACING.sm,
  },
  welcomeTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
    lineHeight: 20,
  },
});
export default DummyHomeScreen;
