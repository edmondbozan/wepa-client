import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
        //Alert.alert('ok');
        const data = await response.json();        
        //Alert.alert(JSON.stringify(data.token));
        await signIn(data.token, data.token);
        //Alert.alert('Login successful');
        router.replace('/');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred', 'Please try again later');
    }
  };

  return (
<View style={styles.container}>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        style={styles.input}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

