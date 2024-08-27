import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  signIn: (token: string, userId: string, userType: string) => void;
  signOut: () => void;
  setGuest: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userType: string | null;
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: (token: string, userId: string, userType:string) => null,
  signOut: () => null,
  setGuest: () => null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  userId: null,
  userType: null
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
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserType = await AsyncStorage.getItem('userType');        
        if(storedUserType == "guest"){
          setSession(null);
          setUserId(null);
          setIsAuthenticated(false); 
        }else if (token && storedUserId) {
          setSession(token);
          setUserId(storedUserId);
          setUserType(storedUserType);
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
        signIn: async (token: string, userId: string, userType: string) => {
          try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userType', userType);
            setSession(token);
            setUserId(userId);
            setUserType(userType);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Failed to sign in', error);
          }
        },
        signOut: async () => {
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('userType');
            setSession(null);
            setUserId(null);
            setIsAuthenticated(false);
          } catch (error) {
            console.error('Failed to sign out', error);
          }
        },
        setGuest: async () => {
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('userType');
            await AsyncStorage.setItem('userType', 'guest');
            setSession(null);
            setUserId(null);
            setUserType('guest');
            setIsAuthenticated(false);
          } catch (error) {
            console.error('Failed to sign out', error);
          }
        },
        session,
        isLoading,
        isAuthenticated,        
        userId,
        userType,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
