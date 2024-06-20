// index.tsx
import React from 'react';
import { useNavigation, Tabs, Stack, router, Redirect } from 'expo-router';
import { useSession } from '@/context/ctx';
import { Alert, Text } from 'react-native';



export default function index() {
  const { isAuthenticated } = useSession();

  // Alert.alert(JSON.stringify(isAuthenticated));
  //  if (!isAuthenticated) {
  // //   // On web, static rendering will stop here as the user is not authenticated
  // //   // in the headless Node process that the pages are rendered in.

  //     return <Redirect href="/auth/login" />;
  // }

  // if (isAuthenticated) {
  //   //   // On web, static rendering will stop here as the user is not authenticated
  //   //   // in the headless Node process that the pages are rendered in.
  
  //       return <Redirect href="/(tabs)/home" />;
  //   }





  // React.useEffect(() => {
  //    Alert.alert(JSON.stringify(isAuthenticated));
  //    Alert.alert(JSON.stringify(userId));
  //    if (isAuthenticated) {
  //      router.replace('/(tabs)/home');
  //    } else {
  //      router.replace('/auth/login');
  //    }
  // }, [isAuthenticated]); 

  return (
    
    
    <>{ isAuthenticated ? ( <Redirect href="/(tabs)/home" />) : 
  ( <Redirect href="/auth/login" />)
}</>
  )};