import React, { useState } from 'react';
import { useStorageState } from './useStorageState';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AuthContextType = {
  signIn: (token: string, user: any)=> void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: (token: string, user: any) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isAuthenticated : false
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

  return (
    <AuthContext.Provider
      value={{
        signIn: async (token: string, user: any) => {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          setIsAuthenticated(true);
          setUser(user);
        },
        signOut: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        },
        session,
        isLoading,
        isAuthenticated
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
