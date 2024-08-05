import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome } from '@expo/vector-icons';
import { normalize } from 'react-native-elements';

const UserSettings: React.FC = () => {
  const { signOut, userId } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

const handleHelp = () =>{
  router.navigate("help/help_0");
}
const handleClose = () =>{
    router.navigate("settings/settings");
  }
  const handleNext = () =>{
    router.navigate("help/hrlp_1");
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require('../../assets/images/reset-background.jpeg')} imageStyle={{ opacity: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text onPress={handleClose}>close</Text>
        <Text onPress={handleNext}>next</Text>
        <View style={styles.itemContainer}>
            <Text style={{fontSize:normalize(30), fontWeight:200}}>a more moderen approach for matching home professionals and home owners.</Text>       
        </View>
        <View style={styles.itemContainer}>
            <Text style={{fontSize:normalize(30), fontWeight:200}}>home owners: looking for a profesional or just an inspiration we got you.</Text>       
        </View>
        <View style={styles.itemContainer}>
            <Text style={{fontSize:normalize(30), fontWeight:200}}>home owners: looking for a profesional or just an inspiration we got you.</Text>       
        </View>
        </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    opacity:.9,    
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
