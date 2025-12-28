import React, { useState } from 'react';
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
import { AuthStackParamList, SignUpCredentials } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { validateSignUp, getPasswordErrors } from '../../utils/validation';
import { styles } from './styles';
import { theme } from '../../theme';

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpNavigationProp>();
  const { signUp, isLoading } = useAuth();

  const [credentials, setCredentials] = useState<SignUpCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSignUp = async () => {
    const validation = validateSignUp(credentials);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    
    try {
      await signUp(credentials);
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    }
  };

  const handleInputChange = (field: keyof SignUpCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderPasswordRequirements = () => {
    if (!credentials.password) return null;

    const passwordErrors = getPasswordErrors(credentials.password);
    const requirements = [
      { text: 'At least 8 characters', met: credentials.password.length >= 8 },
      { text: 'One uppercase letter', met: /[A-Z]/.test(credentials.password) },
      { text: 'One lowercase letter', met: /[a-z]/.test(credentials.password) },
      { text: 'One number', met: /[0-9]/.test(credentials.password) },
    ];

    return (
      <View style={styles.requirementsContainer}>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirementRow}>
            <Icon
              name={req.met ? 'check-circle' : 'radio-button-unchecked'}
              size={16}
              color={req.met ? theme.colors.success : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.requirementText,
                req.met && styles.requirementTextMet,
              ]}
            >
              {req.text}
            </Text>
          </View>
        ))}
      </View>
    );
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
              <Icon name="person-add" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
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
              placeholder="Create a password"
              value={credentials.password}
              onChangeText={(text) => handleInputChange('password', text)}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            {renderPasswordRequirements()}

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={credentials.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.signInButton}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
