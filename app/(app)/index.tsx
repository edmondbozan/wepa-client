import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';

export default function Index() {
  const { setGuest } = useSession();
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null for loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/Auth');
        if (!response.ok) {
          setGuest();
        } 
      } catch (err) {
        setGuest();
      }
    };

    fetchData();
  }, []);

  // if (isAuthenticated === null) {
  //   // While loading, you can return a loading indicator or nothing
  //   return <View></View>;
  // }

  return (
    <>
        <Redirect href="/(tabs)/home" />      
    </>
  );
}

