import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';
import GlobalStyles from '@/styles/styles';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

const Register: React.FC = () => {
  const { signIn } = useSession();
  const [userType, setUserType] = useState<'professional' | 'consumer' | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    validateForm();
  }, [userType, username, password, verifyPassword, phone, email, displayName, zipcode]);

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;
    const isVerifyPasswordValid = password === verifyPassword;
    const isPhoneValid = phone.match(/^\d{10}$/) !== null; // Assuming phone number should be exactly 10 digits
    const isZipcodeValid = zipcode.match(/^\d{5}$/) !== null; // Zipcode should be exactly 5 digits
    const areFieldsFilled = userType && username && password && verifyPassword && phone && email && displayName && zipcode;

    const errors: { [key: string]: boolean } = {
      userType: !userType,
      username: !username,
      password: !isPasswordValid,
      verifyPassword: !isVerifyPasswordValid,
      phone: !isPhoneValid,
      email: !isEmailValid,
      displayName: !displayName,
      zipcode: !isZipcodeValid,
    };

    setValidationErrors(errors);

    if (isEmailValid && isPasswordValid && isPhoneValid && isZipcodeValid && areFieldsFilled && isVerifyPasswordValid) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (password !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      console.log(JSON.stringify({
        userType: userType,
        Username: username,
        Email: email,
        Password: password,
        ZipCode: zipcode,
        PhoneNumber: phone
      }));

      const response = await fetch(BASE_URL + '/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: userType,
          Username: username,
          Email: email,
          Password: password,
          ZipCode: zipcode,
          PhoneNumber: phone
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await signIn(data.token, JSON.stringify(data.userId));
        router.replace('/');
      } else {
        Alert.alert('Error', data.Message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets={true}>
      <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background} imageStyle={{ opacity: 0.6 }}>
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

          <Text style={styles.label}>Username:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            style={[styles.input, validationErrors.username && styles.inputError]}
          />
          <Text>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            style={[styles.input, validationErrors.password && styles.inputError]}
          />
          <Text>Verify Password:</Text>
          <TextInput
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            placeholder="Verify password"
            secureTextEntry
            style={[styles.input, validationErrors.verifyPassword && styles.inputError]}
          />
          <Text>Phone:</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            style={[styles.input, validationErrors.phone && styles.inputError]}
            returnKeyType="done"
          />
          <Text>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            style={[styles.input, validationErrors.email && styles.inputError]}
          />
          <Text>Display Name:</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter display name"
            style={[styles.input, validationErrors.displayName && styles.inputError]}
          />
          <Text>Zipcode:</Text>
          <TextInput
            value={zipcode}
            onChangeText={setZipcode}
            placeholder="Enter zipcode"
            keyboardType="number-pad"
            style={[styles.input, validationErrors.zipcode && styles.inputError]}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={handleRegister} disabled={isButtonDisabled}>
              <View style={[GlobalStyles.buttonContainer, isButtonDisabled && styles.buttonDisabled]}>
                <Text style={GlobalStyles.button}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adds a white background with transparency to the container
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
  label: {
    color: '#FFF',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50, // Increase the height of the input fields
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with transparency
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  buttonDisabled: {
    backgroundColor: '#ccc', // Grey background for disabled button
  },
});

export default Register;
