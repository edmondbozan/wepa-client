import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator, Button, KeyboardAvoidingView, Platform, Modal, Animated } from 'react-native';
import { router } from 'expo-router';
import { normalize } from 'react-native-elements';

interface PleaseLoginProps {
  visible: boolean;
  message:string;
  onClose: () => void;
}



const PleaseLoginModal: React.FC<PleaseLoginProps> = ({ visible, onClose, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value of 0
  
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in to opacity 1
        duration: 500, // Animation duration in milliseconds (adjust this value)
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out to opacity 0
        duration: 500, // Animation duration in milliseconds (adjust this value)
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);


 return (
  <Modal
  animationType="slide"
  transparent={false}
  visible={visible}
  onRequestClose={onClose}>

<Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          opacity: fadeAnim, // Bind opacity to animated value
        }}>
         <View style={styles.itemContainer}>
          <Text style={{ color: "#000", fontSize: normalize(30), fontWeight: '200', lineHeight: normalize(30) }}>
            You must be logged in to perform this action.  Login or create account.
          </Text>
          <View style={{ flexDirection:'row', justifyContent:'space-evenly' }}>
          <TouchableOpacity style={styles.skippedButton} onPress={()=>{onClose();}}>
              <Text style={styles.skippedButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skippedButton} onPress={()=>{onClose();}}>
              <Text style={styles.skippedButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Animated.View>
        </Modal>
 )}
 const styles = StyleSheet.create({

  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    marginLeft: 0,
  },
  modalContent: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
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
  skippedButton: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    padding: 10,
    borderColor: '#B87333'
  },
  skippedButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }

});

export default PleaseLoginModal;
