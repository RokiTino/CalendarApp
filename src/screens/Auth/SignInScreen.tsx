import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { AuthStackParamList, SignInCredentials } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { validateSignIn } from '../../utils/validation';
import { styles } from './styles';
import { theme } from '../../theme';

type SignInNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInNavigationProp>();
  const {
    signIn,
    signInWithBiometrics,
    checkBiometricAvailability,
    isBiometricsEnabled,
    biometryType,
    isLoading,
    error,
  } = useAuth();

  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const available = await checkBiometricAvailability();
    setIsBiometricAvailable(available);
  };

  const handleSignIn = async () => {
    const validation = validateSignIn(credentials);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    
    try {
      await signIn(credentials);
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message);
    }
  };

  const handleBiometricSignIn = async () => {
    try {
      const success = await signInWithBiometrics();
      if (!success) {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication was not successful. Please try again or use your email and password.'
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleInputChange = (field: keyof SignInCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Icon name="event" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={credentials.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={credentials.password}
              onChangeText={(text) => handleInputChange('password', text)}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
              style={styles.signInButton}
            />

            {isBiometricAvailable && isBiometricsEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricSignIn}
              >
                <Icon
                  name={biometryType === 'Face ID' ? 'face' : 'fingerprint'}
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.biometricText}>
                  Sign in with {biometryType || 'Biometrics'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
