import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { ImageBackground } from 'expo-image';
import { normalize } from 'react-native-elements';
import { BASE_URL } from '@/constants/Endpoints';
import fetchWithAuth from '@/context/FetchWithAuth';
import { useSession } from '@/context/ctx';

interface EmptyHomeProps {
    onUnlike:() => void;
  }
  

const EmptyHome: React.FC<EmptyHomeProps> = ({onUnlike}) => {
    const { userId } = useSession();
    const unlikeProjects =  async() =>{
        try {
          console.log(`${BASE_URL}/api/projects/users/${userId}/unlike`);
          const response = await fetchWithAuth(`${BASE_URL}/api/projects/users/${userId}/unlike` , {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
          });
    
          const responseText = await response.text();
    
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${responseText}`);
          }
          onUnlike();
        } catch (error) {
          Alert.alert('Reuest failed.  Please try again.');
        }

    }
  return (
    <GestureHandlerRootView>
    <ImageBackground style={{flex:1}} source={require('../assets/images/background.jpg')} imageStyle={{ opacity: 0.3, height:'100%' }}>
          <View style={{marginTop:100, margin:20, padding:15, borderRadius:12, backgroundColor:'rgba(211, 211, 211, .35)'}}>
            <Text style={{color:"#654321", fontSize:20, fontWeight:'700', lineHeight:30}}>You have viewed all projects that fit your criteria.{'\n\n'}</Text>
            <View style={{alignItems:'center'}}>
              <Text style={{color:"#654321", fontSize:normalize(17), fontWeight:'600',fontStyle:'italic', lineHeight:30}}> Adjust your criteria above to see more or review skipped projects.</Text>
            </View>
              <View style={{alignItems:'center'}}> 
              <TouchableOpacity style={styles.skippedButton} onPress={unlikeProjects}>
            <Text style={styles.skippedButtonText}>Review skipped projects</Text>
          </TouchableOpacity>
            </View>
          </View>
         </ImageBackground>
         </GestureHandlerRootView>
  );};

const styles = StyleSheet.create({
    skippedButton: {
      height: 50,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 20,
      borderWidth: 2,
      padding:10,
      borderColor: '#B87333'
    },
    skippedButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    }
});

export default EmptyHome;





