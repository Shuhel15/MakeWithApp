import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Share,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/auth';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { ProfileImagePicker } from '../components/ProfileImagePicker';
import { CustomButton } from '../components/CustomButton';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetup'>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupScreenNavigationProp;
  route: ProfileSetupScreenRouteProp;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
  route,
}) => {
  const { user } = route.params;
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Generate a customized invite link using clean username
  const cleanUsername = user.username.replace(/^@/, '');
  const inviteLink = `https://makewith.app/invite/${cleanUsername}`;

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join me on MakeWith! Invite your friends and start discovering products together. Use my invite link: ${inviteLink}`,
      });
    } catch (error) {
      console.error('Error sharing link', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(inviteLink);
      Alert.alert('Link Copied', 'Invite link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link', error);
      Alert.alert('Error', 'Failed to copy link to clipboard.');
    }
  };

  const handleFinish = () => {
    // Save image to mock session or user state if needed, then redirect
    if (avatarUri) {
      user.avatarUrl = avatarUri;
    }
    
    // Reset navigation stack to Home screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Add Profile Photo</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose a picture so friends can recognize you.
        </Text>
      </View>

      {/* Profile Avatar Selection */}
      <ProfileImagePicker
        selectedImageUri={avatarUri}
        onImageSelected={setAvatarUri}
      />

      {/* Invite Friends Promotion */}
      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="people" size={24} color={theme.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Invite Friends</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          "Invite your friends and start discovering products together."
        </Text>

        <View style={[styles.linkContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]} numberOfLines={1}>
            {inviteLink}
          </Text>
          <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7} style={styles.copyBadge}>
            <Ionicons name="copy-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleShareLink}
          activeOpacity={0.7}
          style={[styles.shareTextButton]}
        >
          <Ionicons name="share-social-outline" size={18} color={theme.primary} style={{ marginRight: SPACING.xs }} />
          <Text style={[styles.shareText, { color: theme.primary }]}>Share Invite Link</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <CustomButton
          title={avatarUri ? 'Save & Continue' : 'Continue'}
          onPress={handleFinish}
          style={styles.mainButton}
        />
        {!avatarUri && (
          <TouchableOpacity onPress={handleFinish} activeOpacity={0.7} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: theme.textMuted }]}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.xxl,
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
  card: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginVertical: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md,
  },
  linkText: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  copyBadge: {
    padding: SPACING.xs,
  },
  shareTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  shareText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  mainButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: SPACING.md,
  },
  skipText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
});
export default ProfileSetupScreen;
