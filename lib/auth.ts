import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  ApplicationVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from './types';

// ============================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  userType: 'farmer' | 'industry'
): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email,
      displayName,
      userType,
    });

    return user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
}

// ============================================
// PHONE AUTHENTICATION
// ============================================

/**
 * Setup reCAPTCHA for phone authentication
 */
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
  });
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(
  phoneNumber: string,
  appVerifier: ApplicationVerifier
): Promise<ConfirmationResult> {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

/**
 * Verify OTP and sign in
 */
export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  otp: string,
  userType: 'farmer' | 'industry',
  displayName?: string
): Promise<FirebaseUser> {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create user document for new phone users
      await createUserDocument(user.uid, {
        phoneNumber: user.phoneNumber || undefined,
        displayName: displayName || user.phoneNumber || 'User',
        userType,
      });

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }
    }

    return user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * Create user document in Firestore
 */
async function createUserDocument(
  uid: string,
  data: {
    email?: string;
    phoneNumber?: string;
    displayName: string;
    userType: 'farmer' | 'industry';
  }
): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

/**
 * Listen to authentication state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format phone number to E.164 format (for India)
 * Example: 9876543210 -> +919876543210
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+91'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // If it already starts with country code, return as is
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If it's a 10-digit number, add country code
  if (cleaned.length === 10) {
    return `${countryCode}${cleaned}`;
  }

  // Return with country code
  return `${countryCode}${cleaned}`;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 12;
}
