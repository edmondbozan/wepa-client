import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '@/context/ctx';
import { BASE_URL } from '@/constants/Endpoints';
import { normalize } from 'react-native-elements';
import { router } from 'expo-router';
import AuthLoginButton from '@/components/AuthLoginButton';
import { ExternalLink } from '@/components/ExternalLink';

export default function SignIn() {
  const { signIn, zip, setNewZip } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  const usernameInputRef = useRef<TextInput>(null);

  const handleRegister =  () => {
    router.push('/auth/register');
  };


  const handleGuest = () => {
    router.push('/');
  };

  const handleForgot = () => {
    router.push('/auth/reset');
  };

  const oAuthLogin = async (userData: UserAuthData) => {
    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL + '/api/auth/login/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.fullName?.givenName,
          email: userData.email,
          userId: userData.userId
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await signIn(data.token, JSON.stringify(data.userId), data.userType, (zip) ? zip : "07657");
        if (data.newRecord) {
          router.replace('/auth/register');
        } else {
          router.replace('/');
        }
      } else {
        Alert.alert('Login failed', 'Network error.  Please try again');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Login failed', 'Network error.  Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };




  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await signIn(data.token, JSON.stringify(data.userId), data.userType, (zip) ? zip : "07657");
        router.replace('/');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('An error occurred', error.message || 'Please try again later');
      } else {
        Alert.alert('An error occurred', 'Please try again later');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets={true}>
        <ImageBackground
          style={styles.backgroundImage}
          source={require('../../assets/images/backgrounds/login.jpg')}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleRegister} style={styles.signUpButton}>
              <Text style={styles.signUpText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: normalize(20), marginStart: normalize(10), backgroundColor: 'rgba(0,0,0,.15)' }}>
            <Text style={[styles.headerText, {fontFamily:'Italianno-Regular'}]}>Find your{'\n'}<View style={{width:normalize(25)}}></View>forever Pro</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="email"
                placeholderTextColor="#000000"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onBlur={() => { usernameInputRef.current?.focus(); }}
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                placeholderTextColor="#000000"
                secureTextEntry
                style={styles.input}
                editable={!isLoading}
                ref={usernameInputRef}
              />
              <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              <TouchableOpacity style={[styles.button, {flex:1}]} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Sign in</Text>
                )}
              </TouchableOpacity>
              <View style={{width: normalize(10)}}></View>
              <TouchableOpacity style={[styles.button, {flex:1}]} onPress={handleGuest} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Guest Mode</Text>
                )}
              </TouchableOpacity>
              </View>

              <AuthLoginButton onLoginSuccess={oAuthLogin} onLoginFailure={function (error: any): void {
                console.log(JSON.stringify(error));
              }}></AuthLoginButton>
                            <TouchableOpacity style={styles.forgotButton} onPress={handleForgot} disabled={isLoading}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
          <View style={{ marginVertical: normalize(10) }}>
            <Text>By authenticating, you confirm that you have read and agree to our <ExternalLink style={{ color: '#007bff', textDecorationLine: 'underline' }} href={'https://app.termly.io/policy-viewer/policy.html?policyUUID=92b8a492-eea6-4e68-9727-7430bc07dac5'}>privacy policy</ExternalLink> and <ExternalLink href={'https://app.termly.io/policy-viewer/policy.html?policyUUID=e7fd608a-64a0-4e12-91b9-e154a15eb707'} style={{ color: '#007bff', textDecorationLine: 'underline' }} >terms and conditions</ExternalLink>.</Text>
          </View>




            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
//    flexDirection: 'column',
    position:'absolute',
    right:10,
    margin: 10,
    zIndex:999
  },
  signUpButton: {
    borderColor: '#B87333',
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Light background for better contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  formContainer: {
    height: '100%',
  },
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    margin: 20,
  },
  label: {
    color: '#000',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#B87333',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'rgba(111, 111, 111, 0.1)', // Darker background for inputs
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#B87333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  forgotButton: {
    marginTop: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  forgotText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    color: "white",
    fontSize: normalize(85),
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

});
