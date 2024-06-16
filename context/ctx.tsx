import React, { useState } from 'react';
import { useStorageState } from './useStorageState';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AuthContextType = {
  signIn: (token: string, user: any)=> void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId:string | null;
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: (token: string, user: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isAuthenticated : false,
  userId: null
});

// This hook can be used to access the user info.
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
   const [[isLoading, session], setSession] = useStorageState('session');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string|null>(null);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (token: string, userId: string) => {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', userId);
          setUserId(userId);
          setIsAuthenticated(true);
          setUser(user);
        },
        signOut: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
          setIsAuthenticated(false);
          setUser(null);
        },
        session,
        isLoading,
        isAuthenticated,
        userId
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
