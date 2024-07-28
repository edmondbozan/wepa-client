import React from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { ProjectDetails } from '@/interfaces/IProject';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome } from '@expo/vector-icons';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { GestureHandlerRootView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';



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
        Alert.alert('Failed to Delete User.', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Failed to Delete User.', 'Please try again.');
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
    <SafeAreaView style={{flex:1}}>
    <GestureHandlerRootView>
      <View style={styles.itemContainer}>
      <TouchableOpacity onPress={handleSignOut}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome name="lock" size={18} color="#B87333" />
          <Text> Sign Out</Text>
        </View>
        </TouchableOpacity>
        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
          <TouchableOpacity onPress={handleDeleteAccount}>
          <View style={{ flexDirection:'row' }}>
          <FontAwesome  name="trash" size={18} color="#B87333" />
          <Text> Delete Account</Text>
          </View>
          </TouchableOpacity>
      </View>
      </GestureHandlerRootView>
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
//    flex:1
  },
});

export default Settings;
