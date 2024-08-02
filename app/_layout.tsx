import { Redirect, Slot, Stack } from 'expo-router';
import { SessionProvider, useSession } from '@/context/ctx';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const loadFonts = async () => {
  await Font.loadAsync({
    'Pacifico-Regular': require('../assets/fonts/Pacifico-Regular.ttf'),
    // 'Playwrite-AUVIC-Bold': require('../assets/fonts/wepaClient/assets/fonts/PlaywriteAUVIC-Regular.ttf'),
  });
};

export default function Root() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  // Set up the auth context and render our layout inside of it.

  return (

    <SessionProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  </SessionProvider>
  );
}