import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';
import { isLoaded } from 'expo-font';

export default function Index() {
  const { setGuest } = useSession();
  const [loaded, setloaded] = useState(false);
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
      finally{
        setloaded(true);
      }
    };

    fetchData();
  }, []);


  return (
    <>
    {loaded &&
        <Redirect href="/(tabs)/home" />      
    }
    </>
  );
}

