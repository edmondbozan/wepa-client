import { Redirect, Slot, Stack } from 'expo-router';
import { SessionProvider, useSession } from '@/context/ctx';
import React from 'react';
import { Text } from 'react-native';
import LogoutButton from '@/components/LogoutButton';

export default function Root() {
  // Set up the auth context and render our layout inside of it.

  return (

      <SessionProvider>        
      <LogoutButton></LogoutButton>
      <Slot />
      </SessionProvider>
  );
}