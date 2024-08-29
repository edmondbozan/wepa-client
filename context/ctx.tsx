import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  signIn: (token: string, userId: string, userType: string, zip: string) => void;
  signOut: () => void;
  setGuest: () => void;
  setNewZip:(zip:string) => void;
  setNewUserType:(userType:string) => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userType: string | null;
  zip: string| null;
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: (token: string, userId: string, userType:string, zip:string) => null,
  signOut: () => null,
  setGuest: () => null,
  setNewZip:(zip:string) => null,
  setNewUserType:(userType:string) => null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  userId: null,
  userType: null, 
  zip:null
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
  const [zip, setZip] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserType = await AsyncStorage.getItem('userType');  
        const storedZip = await AsyncStorage.getItem('zip');  

        if(storedUserType == "guest"){
          setSession(null);
          setUserId(null);
          setIsAuthenticated(false); 
        }else if (token && storedUserId) {
          setSession(token);
          setUserId(storedUserId);
          setUserType(storedUserType);
          setIsAuthenticated(true); 
          setZip(storedZip);
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
        signIn: async (token: string, userId: string, userType: string, zip:string) => {
          try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userType', userType);
            await AsyncStorage.setItem('zip', zip);
            setSession(token);
            setUserId(userId);
            setUserType(userType);
            setZip(zip);
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
        setNewZip: async(newZip:string) =>{
          try {
            await AsyncStorage.setItem('zip', newZip);
            setZip(newZip); // Update the zip state
          } catch (error) {
            console.error('Failed to update zip in AsyncStorage', error);
          }

        },
        setNewUserType: async(userType:string) =>{
          try {
            await AsyncStorage.setItem('userType', userType);
            setUserType(userType); // Update the zip state
          } catch (error) {
            console.error('Failed to update userType in AsyncStorage', error);
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
            setZip('07302');
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
        zip
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
