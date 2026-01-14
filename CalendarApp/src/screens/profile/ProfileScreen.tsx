import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    logout,
    isLoading,
    isBiometricsEnabled,
    setBiometricsEnabled,
  } = useAuth();

  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const { available, biometryType: type } = await rnBiometrics.isSensorAvailable();
        if (available && type) {
          setBiometryType(type);
        }
      } finally {
        setIsCheckingBiometrics(false);
      }
    };
    checkBiometrics();
  }, []);

  const getBiometryLabel = () => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Fingerprint';
      default:
        return 'Biometric Login';
    }
  };

  const getBiometryDescription = () => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Use Face ID to sign in quickly';
      case BiometryTypes.TouchID:
        return 'Use Touch ID to sign in quickly';
      case BiometryTypes.Biometrics:
        return 'Use fingerprint to sign in quickly';
      default:
        return 'Use biometrics to sign in quickly';
    }
  };

  const getBiometryIcon = () => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return '👤';
      case BiometryTypes.TouchID:
      case BiometryTypes.Biometrics:
        return '👆';
      default:
        return '🔐';
    }
  };

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  }, [logout]);

  const handleBiometricsToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        if (!biometryType) {
          Alert.alert(
            'Biometrics Unavailable',
            'Your device does not support biometric authentication or it has not been set up.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Verify biometrics work before enabling
        try {
          const rnBiometrics = new ReactNativeBiometrics();
          const { success } = await rnBiometrics.simplePrompt({
            promptMessage: `Confirm ${getBiometryLabel()} to enable`,
          });

          if (success) {
            setBiometricsEnabled(true);
            Alert.alert(
              'Success',
              `${getBiometryLabel()} has been enabled for sign in.`,
              [{ text: 'OK' }]
            );
          }
        } catch {
          Alert.alert(
            'Verification Failed',
            'Could not verify your biometrics. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        setBiometricsEnabled(false);
      }
    },
    [setBiometricsEnabled, biometryType, getBiometryLabel]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.displayName}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={styles.email}>{user?.email || 'No email'}</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          {isCheckingBiometrics ? (
            <View style={styles.settingItem}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Checking biometric availability...</Text>
            </View>
          ) : biometryType ? (
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Text style={styles.settingIcon}>{getBiometryIcon()}</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{getBiometryLabel()}</Text>
                <Text style={styles.settingDescription}>
                  {getBiometryDescription()}
                </Text>
              </View>
              <Switch
                value={isBiometricsEnabled}
                onValueChange={handleBiometricsToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={isBiometricsEnabled ? Colors.primary : Colors.white}
              />
            </View>
          ) : (
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Text style={styles.settingIconDisabled}>🔐</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabelDisabled}>Biometric Login</Text>
                <Text style={styles.settingDescription}>
                  Not available on this device
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            loading={isLoading}
            fullWidth
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>CalendarApp v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  userInfo: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingIconDisabled: {
    fontSize: 20,
    opacity: 0.5,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  settingLabelDisabled: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textLight,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  menuItemArrow: {
    fontSize: FontSize.xl,
    color: Colors.textLight,
  },
  logoutSection: {
    padding: Spacing.lg,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  logoutButtonText: {
    color: Colors.error,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
});
