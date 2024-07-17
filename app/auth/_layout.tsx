import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '@/context/ctx';
import React from 'react';
import { useRootNavigationState, Redirect } from 'expo-router';
export default function AuthLayout() {
  // if (!rootNavigationState?.key) return null;
  
  // Set up the auth context and render our layout inside of it.
  return (
    <Stack>
    <Stack.Screen name="login" options={{ title: 'Login', headerShown : false }} />
    <Stack.Screen name="register" options={{ title: 'Register', headerShown : false }} /> 
    <Stack.Screen name="reset" options={{ title: 'Reset', headerShown : false }} /> 

  </Stack>
  );
}