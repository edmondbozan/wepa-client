import { router } from 'expo-router';
import { Alert, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      console.error(error);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={require('.././../assets/images/background.jpg')} style={styles.background} imageStyle={{ opacity: 0.9 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
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
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#FFF"
            secureTextEntry
            style={styles.input}
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>SIGN IN</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleForgot} disabled={isLoading}>
            <Text style={styles.buttonText}>FORGOT PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

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
    borderWidth: 2,
    borderColor: '#B87333',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
