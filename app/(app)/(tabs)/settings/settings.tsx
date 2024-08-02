import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome } from '@expo/vector-icons';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

const UserSettings: React.FC = () => {
  const { signOut, userId } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.navigate("auth/login");
  };


  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "All data will be permanently deleted.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: deleteUser }
      ],
      { cancelable: false }
    );
  };

  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        signOut();
        router.navigate("auth/login");
      } else {
        Alert.alert('Failed to Delete User.', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Failed to Delete User.', 'Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={styles.itemContainer}>
          <TouchableOpacity onPress={handleSignOut} disabled={isDeleting}>
            <View style={styles.optionContainer}>
              <FontAwesome name="lock" size={18} color="#B87333" />
              <Text> Sign Out</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={handleDeleteAccount} disabled={isDeleting}>
            <View style={styles.optionContainer}>
              <FontAwesome name="trash" size={18} color="#B87333" />
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default UserSettings;
