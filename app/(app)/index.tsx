import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null for loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/Auth');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, []);

  if (isAuthenticated === null) {
    // While loading, you can return a loading indicator or nothing
    return <View></View>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/auth/login" />
      )}
    </>
  );
}

