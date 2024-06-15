import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<'professional' | 'consumer' | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');

  const handleRegister = async () => {
    if (password !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Registration logic here...
    Alert.alert(
      `Registration Info`,
      `User Type: ${userType}, Username: ${username}, Email: ${email}, Phone: ${phone}, Display Name: ${displayName}, Zipcode: ${zipcode}, License Number: ${licenseNumber}, Membership ID: ${membershipId}`
    );
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
    <View style={styles.container}>
      <Text>Select User Type:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity style={styles.radio} onPress={() => setUserType('professional')}>
          <View style={userType === 'professional' ? styles.radioSelected : styles.radioUnselected} />
          <Text>Professional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radio} onPress={() => setUserType('consumer')}>
          <View style={userType === 'consumer' ? styles.radioSelected : styles.radioUnselected} />
          <Text>Consumer</Text>
        </TouchableOpacity>
      </View>

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
      <Text>Verify Password:</Text>
      <TextInput
        value={verifyPassword}
        onChangeText={setVerifyPassword}
        placeholder="Verify password"
        secureTextEntry
        style={styles.input}
      />
      <Text>Phone:</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        style={styles.input}
        returnKeyType="done"
      />
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
        style={styles.input}
      />
      <Text>Display Name:</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Enter display name"
        style={styles.input}
      />
      <Text>Zipcode:</Text>
      <TextInput
        value={zipcode}
        onChangeText={setZipcode}
        placeholder="Enter zipcode"
        keyboardType="number-pad"
        style={styles.input}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
    marginRight: 5,
  },
  radioUnselected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginRight: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Register;
