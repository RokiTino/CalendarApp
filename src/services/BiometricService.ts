import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { BiometricResult } from '../types';

const rnBiometrics = new ReactNativeBiometrics();

/**
 * Check if biometric sensor is available
 */
export const checkBiometricAvailability = async (): Promise<BiometricResult> => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      return {
        available: false,
        error: 'Biometric authentication is not available on this device.',
      };
    }

    return {
      available: true,
      biometryType: getBiometryTypeName(biometryType),
    };
  } catch (error: any) {
    return {
      available: false,
      error: error.message || 'Failed to check biometric availability.',
    };
  }
};

/**
 * Get human-readable biometry type name
 */
const getBiometryTypeName = (biometryType: string | undefined): string => {
  switch (biometryType) {
    case BiometryTypes.TouchID:
      return 'Touch ID';
    case BiometryTypes.FaceID:
      return 'Face ID';
    case BiometryTypes.Biometrics:
      return 'Fingerprint';
    default:
      return 'Biometrics';
  }
};

/**
 * Prompt user for biometric authentication
 */
export const authenticateWithBiometrics = async (
  promptMessage: string = 'Authenticate to continue'
): Promise<boolean> => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      throw new Error('Biometric authentication is not available.');
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Cancel',
    });

    return success;
  } catch (error: any) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

/**
 * Create biometric keys for secure storage
 */
export const createBiometricKeys = async (): Promise<string | null> => {
  try {
    const { publicKey } = await rnBiometrics.createKeys();
    return publicKey;
  } catch (error: any) {
    console.error('Failed to create biometric keys:', error);
    return null;
  }
};

/**
 * Delete biometric keys
 */
export const deleteBiometricKeys = async (): Promise<boolean> => {
  try {
    const { keysDeleted } = await rnBiometrics.deleteKeys();
    return keysDeleted;
  } catch (error: any) {
    console.error('Failed to delete biometric keys:', error);
    return false;
  }
};

/**
 * Check if biometric keys exist
 */
export const biometricKeysExist = async (): Promise<boolean> => {
  try {
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    return keysExist;
  } catch (error: any) {
    console.error('Failed to check biometric keys:', error);
    return false;
  }
};

/**
 * Get biometric icon name based on type
 */
export const getBiometricIconName = (biometryType: string): string => {
  switch (biometryType) {
    case 'Face ID':
      return 'face-recognition';
    case 'Touch ID':
    case 'Fingerprint':
    default:
      return 'fingerprint';
  }
};

export default {
  checkBiometricAvailability,
  authenticateWithBiometrics,
  createBiometricKeys,
  deleteBiometricKeys,
  biometricKeysExist,
  getBiometricIconName,
};
