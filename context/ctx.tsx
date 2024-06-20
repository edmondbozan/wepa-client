import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  signIn: (token: string, userId: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: (token: string, userId: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  userId: null,
});

export function useSession(): AuthContextType {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (token && storedUserId) {
          setSession(token);
          setUserId(storedUserId);
          setIsAuthenticated(true); 
        }
      } catch (error) { 
        console.error('Failed to load session', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (token: string, userId: string) => {
          try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId);
            setSession(token);
            setUserId(userId);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Failed to sign in', error);
          }
        },
        signOut: async () => {
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            setSession(null);
            setUserId(null);
            setIsAuthenticated(false);
          } catch (error) {
            console.error('Failed to sign out', error);
          }
        },
        session,
        isLoading,
        isAuthenticated,
        userId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
