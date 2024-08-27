import React from 'react';
import { Button, View } from 'react-native';
import Toast from 'react-native-toast-message';

const GuestToast = () => {
  const showToast = () => {
    Toast.show({
      type: 'success', // can be 'success', 'error', or 'info'
      text1: 'Hello!',
      text2: 'This is a toast message 👋',
      position: 'top', // can be 'top', 'bottom', 'center'
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Toast" onPress={showToast} />
      <Toast />
    </View>
  );
};

export default GuestToast;
