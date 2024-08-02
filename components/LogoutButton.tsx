// components/GlobalLogoutButton.tsx
import React from 'react';
import { Button, View, StyleSheet, TouchableOpacity ,Text } from 'react-native';
import { useSession } from '@/context/ctx';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const LogoutButton: React.FC = () => {
  const { isAuthenticated, signOut } = useSession();

  console.log("logout");
  if (!isAuthenticated) return null;

  return (
    <View/>
    // <View style={styles.buttonContainer}>
    // {/* <TouchableOpacity onPress={()=>{
    //     signOut();
    //     router.replace('/auth/login');}}>
    //     <FontAwesome name="sign-out" size={30} color="#000" />
    //     {/* <Text style={styles.text}>Logout</Text>  */}
    // </TouchableOpacity> */}
    // </View>
  );
};

const styles = StyleSheet.create({
    text: {
        fontWeight:'bold'
    },
    buttonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
    color:'#fff'
  },
});

export default LogoutButton;
