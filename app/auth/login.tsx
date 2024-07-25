import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import PhotoCarousel from '@/components/PhotoCarousel';
import normalize from '@/fonts/fonts';
import TypingText from '@/components/TypingComponent';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    router.push('/auth/register');
  };

  // token = await Notifications.getExpoPushTokenAsync({
  //   projectId: Constants.expoConfig.extra.eas.projectId,
  // });

  const handleForgot = async () => {
    router.push('/auth/reset');
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
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
      console.error(error);
      // Check if the error has a response attached with more details
      if (error.response) {
        error.response.json().then(body => {
          Alert.alert('An error occurred', body.message || 'Please try again later');
        }).catch(() => {
          Alert.alert('An error occurred', 'Please try again later');
        });
      } else {
        Alert.alert('An error occurred', error.message || 'Please try again later');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={require('.././../assets/images/background.jpg')} style={styles.background} imageStyle={{ opacity: 0.9 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.signUpText}>Sign Up →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Email"
            placeholderTextColor="#FFF"
            style={styles.input}
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#FFF"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>           
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleForgot}>           
            <Text style={styles.buttonText}>FORGOT PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay to the container
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    color: '#FFF',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#FFF',    
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // White background with transparency
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth:2,
    borderColor:'#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
