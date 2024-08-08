import React, { useRef, useState } from 'react';
import { Alert, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '@/context/ctx';
import { BASE_URL } from '@/constants/Endpoints';
import { normalize } from 'react-native-elements';
import { router } from 'expo-router';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const usernameInputRef = useRef<TextInput>(null);

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleForgot = () => {
    router.push('/auth/reset');
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
        await signIn(data.token, JSON.stringify(data.userId), data.userType);
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
            <TouchableOpacity onPress={handleRegister} disabled={isLoading} style={styles.signUpButton}>
              <Text style={styles.signUpText}>sign up →</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: normalize(100), marginStart: normalize(20), backgroundColor: 'rgba(0,0,0,.25)' }}>
            <Text style={styles.headerText}>find your{'\n'}forever pro</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>e-mail</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="e-mail"
                placeholderTextColor="#000000"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onBlur={() => { usernameInputRef.current?.focus(); }}
              />
              <Text style={styles.label}>password</Text>
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
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>sign in</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.forgotButton} onPress={handleForgot} disabled={isLoading}>
                <Text style={styles.forgotText}>forgot password</Text>
              </TouchableOpacity>
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
    position: "absolute",
    right: 0,
    margin: 20,
  },
  signUpButton: {
    borderColor: '#B87333',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for better contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  signUpText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Text shadow for better readability
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
    marginTop: 10,
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
    fontSize: normalize(60),
  },
});
