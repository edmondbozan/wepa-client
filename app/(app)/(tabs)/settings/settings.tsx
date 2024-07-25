import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { ProjectDetails } from '@/interfaces/IProject';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome } from '@expo/vector-icons';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';



const Settings: React.FC = () => {
  const { signOut, userId } = useSession();
  const handleSignOut = () => {
    signOut();
    router.navigate("auth/login");
  }


  const deletUser = async () => {
    try { 
      console.log(BASE_URL + '/api/auth/users/' + userId);
      const response = await fetchWithAuth(BASE_URL + '/api/auth/users/' + userId, {
        method: 'DELETE',
      });
      const responseText = await response.text();

      if (response.ok) {
        signOut();
        router.navigate("auth/login");
      }
      else{
        Alert.alert('Failed to Delete User');
        console.error('Failed to Delete User:', userId);        
      }
    } catch (error) {
      console.error('Failed to send like:', error);
    }
  }



  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "All data will be permantly deleted.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: () => deletUser() }
      ],
      { cancelable: false }
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome name="lock" size={18} color="#B87333" />
          <Text onPress={handleSignOut}> Sign Out</Text>
        </View>
        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome name="trash" size={18} color="#B87333" />
          <Text onPress={handleDeleteAccount}> Delete Account</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
});

export default Settings;
