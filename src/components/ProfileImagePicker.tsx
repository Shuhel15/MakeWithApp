import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  useColorScheme,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';

interface ProfileImagePickerProps {
  onImageSelected: (uri: string | null) => void;
  selectedImageUri: string | null;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  onImageSelected,
  selectedImageUri,
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const requestPermissionAndPickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant photo library access to upload a profile picture.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        onImageSelected(selectedUri);
      }
    } catch (error) {
      console.error('Error launching image library', error);
      Alert.alert('Error', 'Unable to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatarWrapper, { borderColor: theme.border }]}>
        {selectedImageUri ? (
          <Image source={{ uri: selectedImageUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="person-outline" size={50} color={theme.textMuted} />
          </View>
        )}

        <TouchableOpacity
          onPress={requestPermissionAndPickImage}
          activeOpacity={0.8}
          style={[styles.badge, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {selectedImageUri && (
        <TouchableOpacity
          onPress={removeImage}
          activeOpacity={0.7}
          style={styles.removeButton}
        >
          <Text style={[styles.removeText, { color: theme.error }]}>
            Remove Photo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  removeButton: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  removeText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});
