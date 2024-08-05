import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '@/context/ctx';
import React from 'react';
import { useRootNavigationState, Redirect } from 'expo-router';
export default function AuthLayout() {
  // if (!rootNavigationState?.key) return null;
  
  // Set up the auth context and render our layout inside of it.
  return (
    <Stack>
    <Stack.Screen name="help_0" options={{ title: 'help', headerShown : false }} />
    <Stack.Screen name="help_1" options={{ title: 'help_1', headerShown : false }} />
  </Stack>
  );
}