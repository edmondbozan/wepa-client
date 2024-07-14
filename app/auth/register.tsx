import TypingText from '@/components/TypingComponent';
import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';
import GlobalStyles from '@/styles/styles';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Register: React.FC = () => {
  const { signIn } = useSession();
  const [userType, setUserType] = useState<'professional' | 'consumer' | null>('consumer');
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
    <SafeAreaView>
    <ScrollView contentContainerStyle={{ flexGrow:1 }} automaticallyAdjustKeyboardInsets={true}>      
        <View style={styles.container}>
        <Text style={{color:"#000", fontSize:16,  marginTop:10}} onPress={() => { router.replace('/auth/login'); }}>
        <FontAwesome name="arrow-left" /> Login 
      </Text>
      <ImageBackground source={require('.././../assets/images/register-background.jpg')} style={styles.background} imageStyle={{ opacity: 0.45, backgroundColor:"#000" }}>
        <TypingText text={'Registering is easy.  Almost as asy as finding '}></TypingText>
      {/* <Text style={{color:"#fff", marginLeft:20, fontWeight:'bold'}}></Text> */}
      </ImageBackground>
          <View style={styles.radioContainer}>
            <TouchableOpacity style={styles.radio} onPress={() => setUserType('professional')}>
              <View style={userType === 'professional' ? styles.radioSelected : styles.radioUnselected} />
              <Text style={styles.label}>Professional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radio} onPress={() => setUserType('consumer')}>
              <View style={userType === 'consumer' ? styles.radioSelected : styles.radioUnselected} />
              <Text style={styles.label}>Consumer</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Display Name:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#000"
            style={[styles.input, validationErrors.username && styles.inputError]}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#000"
            secureTextEntry
            
            style={[styles.input, validationErrors.password && styles.inputError]}
          />
          {/* <Text style={styles.label}>Verify Password:</Text>
          <TextInput
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            placeholder="Verify password"
            placeholderTextColor="#fff"
            secureTextEntry
            style={[styles.input, validationErrors.verifyPassword && styles.inputError]}
          /> */}
          <Text style={styles.label}>Phone:</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#000"
            style={[styles.input, validationErrors.phone && styles.inputError]}
            returnKeyType="done"
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#000"

            style={[styles.input, validationErrors.email && styles.inputError]}
          />
          <Text style={styles.label}>Display Name:</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor="#000"
            style={[styles.input, validationErrors.displayName && styles.inputError]}
          />
          <Text style={styles.label}>Zipcode:</Text>
          <TextInput
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="number-pad"
            placeholderTextColor="#000"
            style={[styles.input, validationErrors.zipcode && styles.inputError]}
          />
            <TouchableOpacity onPress={handleRegister} disabled={isButtonDisabled} style={styles.button}>
                <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>
          </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    resizeMode: 'cover',
    height:200,
    width:null,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop:20,
    justifyContent:'space-evenly',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(221, 221, 221, 0.5)', 
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
    borderColor: '#B87333',
    backgroundColor: '#B87333',
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
    color: '#B87333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight:'bold'

  },
  input: {
    height: 50,
    borderColor: '#FFF',    
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // White background with transparency
    borderRadius: 5,
    },
  inputError: {
    // borderColor: 'red',
  },
  buttonDisabled: {
    backgroundColor: '#ccc', // Grey background for disabled button
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
  }

});

export default Register;
