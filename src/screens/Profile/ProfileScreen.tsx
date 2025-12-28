import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { BiometricService } from '../../services/BiometricService';
import { theme } from '../../theme';

const ProfileScreen: React.FC = () => {
  const { user, signOut, isBiometricEnabled, enableBiometric, disableBiometric } = useAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isTogglingBiometric, setIsTogglingBiometric] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const result = await BiometricService.checkAvailability();
      setBiometricAvailable(result.available);
      setBiometricType(result.biometryType || null);
    } catch (error) {
      setBiometricAvailable(false);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    setIsTogglingBiometric(true);
    try {
      if (value) {
        await enableBiometric();
      } else {
        await disableBiometric();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to toggle biometric');
    } finally {
      setIsTogglingBiometric(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const getBiometricIcon = () => {
    return BiometricService.getBiometricIcon(biometricType || undefined);
  };

  const getBiometricLabel = () => {
    if (!biometricType) return 'Biometric Authentication';
    
    switch (biometricType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Fingerprint':
        return 'Fingerprint';
      default:
        return 'Biometric Authentication';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Profile" />

      <View style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color={theme.colors.primary} />
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.emailLabel}>Email</Text>
            <Text style={styles.emailText}>{user?.email || 'Not available'}</Text>
          </View>

          {user?.createdAt && (
            <View style={styles.userInfo}>
              <Text style={styles.emailLabel}>Member since</Text>
              <Text style={styles.emailText}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          {biometricAvailable && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Icon 
                  name={getBiometricIcon()} 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>{getBiometricLabel()}</Text>
                  <Text style={styles.settingDescription}>
                    Sign in quickly with {getBiometricLabel().toLowerCase()}
                  </Text>
                </View>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ 
                  false: theme.colors.border, 
                  true: theme.colors.primary + '80' 
                }}
                thumbColor={isBiometricEnabled ? theme.colors.primary : '#f4f3f4'}
                disabled={isTogglingBiometric}
              />
            </View>
          )}

          {!biometricAvailable && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Icon 
                  name="finger-print-outline" 
                  size={24} 
                  color={theme.colors.textSecondary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, styles.disabledText]}>
                    Biometric Authentication
                  </Text>
                  <Text style={styles.settingDescription}>
                    Not available on this device
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>1</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Button
            title="Sign Out"
            variant="danger"
            onPress={handleSignOut}
            loading={isSigningOut}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginBottom: theme.spacing.md,
  },
  emailLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emailText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 15,
    color: theme.colors.text,
  },
  infoValue: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  signOutContainer: {
    marginTop: 'auto',
    paddingBottom: theme.spacing.lg,
  },
});

export default ProfileScreen;
