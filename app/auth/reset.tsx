import { FontAwesome } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { normalize } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResetPassword: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  const sendCode = async () => {
    try {
      const response = await fetch('https://your-azure-function-url/sendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setStep(2);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send code');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch('https://your-azure-function-url/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
      } else {
        Alert.alert('Invalid code', 'Please enter the correct code');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify code');
    }
  };

  const resetPassword = async () => {
    try {
      const response = await fetch('https://your-backend-url/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      Alert.alert('Success', 'Password reset successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to reset password');
    }
  };

  return (
    <SafeAreaView style={{height:'100%'}}>
    <ScrollView contentContainerStyle={{flexGrow:1}}>            
    <ImageBackground source={require('.././../assets/images/reset-background.jpeg')} style={styles.background} imageStyle={{ opacity: 0.5 }}>   
    <Text style={{ color: "#fff", fontSize: 16, marginTop: 10, marginLeft:10 }} onPress={() => { router.replace('/auth/login'); }}>
            <FontAwesome name="arrow-left" /> Login
          </Text>

    <View style={styles.container}> 
    <View style={{borderWidth:1, borderColor:"#fff", backgroundColor:'rgba(221,221,221,.6)', borderRadius:8, padding:10}}>
    <View style={{alignItems:'center'}}>     
            <Text style={{color:"#000", fontSize:normalize(18), fontWeight:'bold', justifyContent:'center', lineHeight:20, padding:20}}>Recover Password</Text> 
    </View>  
    <View style={styles.inputContainer}>
      {step === 1 && (
        <>
          <Text style={{color:"#000", fontSize:normalize(17), fontWeight:'600', lineHeight:30}}>Enter your phone number</Text>
          <TextInputMask
            type={'custom'}
            options={{
              mask: '+1 (999) 999-9999',
            }}
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <View>
          <TouchableOpacity onPress={sendCode} style={styles.button}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Text>Enter the code sent to your phone</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Verification Code"
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={verifyCode} />
        </>
      )}
      {step === 3 && (
        <>
          <Text>Enter your new password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <Button title="Reset Password" onPress={resetPassword} />
        </>
      )}
      </View>
      </View>
          </View>
      </ImageBackground>
      </ScrollView>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // borderWidth:2,
    marginTop:250,
    padding:10
//    flex:1
    // borderColor:"#000",
  },
  input: {
    height: 50,
    borderColor: '#FFF',    
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
    fontWeight:'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with transparency
    borderRadius: 5,
  },
    inputContainer:{
//    justifyContent:'flex-start'
  },
  background: {
//    flex: 1,
    height:'100%',
    resizeMode: 'cover',
    backgroundColor:'rgba(50,50,50,.7)',
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth:2,
    borderColor:'#B87333',
    flex:1,
    margin:normalize(5)
    // width:'100%'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }

});

export default ResetPassword;
