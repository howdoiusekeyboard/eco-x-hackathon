'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getUserData } from '@/lib/auth';
import { User } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthChange(async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          try {
            const data = await getUserData(firebaseUser.uid);
            setUserData(data);
          } catch (fetchError) {
            console.error('Error fetching user data:', fetchError);
            setUserData(null);
          }
        } else {
          setUserData(null);
        }

        setLoading(false);
      });
    } catch (initError) {
      console.error('Failed to initialize Firebase auth listener:', initError);

      if (initError instanceof Error && initError.message.includes('Firebase configuration error')) {
        setError(
          'Firebase failed to initialize. Check that all NEXT_PUBLIC_FIREBASE_* variables are configured and your domain is authorized in Firebase Authentication.'
        );
      } else {
        setError('Unable to connect to Firebase Authentication. Please retry in a moment.');
      }

      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
