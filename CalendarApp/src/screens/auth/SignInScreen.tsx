import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { AuthStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../theme';
import { validateEmail, validatePassword } from '../../utils/validation';

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { login, loginWithBiometrics, isLoading, error, clearError, isBiometricsEnabled } =
    useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [biometryType, setBiometryType] = useState<string | null>(null);

  useEffect(() => {
    const checkBiometrics = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType: type } = await rnBiometrics.isSensorAvailable();
      if (available && type) {
        setBiometryType(type);
      }
    };
    checkBiometrics();
  }, []);

  const getBiometricLabel = () => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Sign In with Face ID';
      case BiometryTypes.TouchID:
        return 'Sign In with Touch ID';
      case BiometryTypes.Biometrics:
        return 'Sign In with Fingerprint';
      default:
        return 'Sign In with Biometrics';
    }
  };

  const getBiometricIcon = () => {
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

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    clearError();
    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleBiometricSignIn = async () => {
    clearError();
    try {
      await loginWithBiometrics();
    } catch (err) {
      Alert.alert(
        'Biometric Login Failed',
        'Please sign in with your email and password.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              error={errors.password}
              isPassword
              autoCapitalize="none"
              autoComplete="password"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
              fullWidth
              style={styles.signInButton}
            />

            {isBiometricsEnabled && biometryType && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricSignIn}
                activeOpacity={0.7}
              >
                <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text>
                <Text style={styles.biometricButtonText}>{getBiometricLabel()}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  biometricButton: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  biometricButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  signUpLink: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
