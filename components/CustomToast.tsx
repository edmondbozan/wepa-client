import React from 'react';
import { Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const MyCustomToast = (props: any) => (
<BaseToast
    {...props}
    text2NumberOfLines={3}
    style={{
      borderLeftColor: 'purple',
      height: 100, // Increase height to fit more text
      paddingVertical: 10,
      
    }}
    contentContainerStyle={{
      paddingHorizontal: 15,
      flex: 1, // Ensure the content container takes full space
    }}
    text1Style={{
      fontSize: 18,
      fontWeight: 'bold',
    }}
    text2Style={{
      fontSize: 16,
      color: 'black',

    }}
  />);

export const MyCustomErrorToast = (props: any) => (
  <ErrorToast
    {...props}
    text1Style={{
      fontSize: 18, // Increase the font size of the error title
    }}
    text2Style={{
      fontSize: 16, // Increase the font size of the error message
    }}
  />
);
