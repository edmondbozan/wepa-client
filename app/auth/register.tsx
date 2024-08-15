import TypingText from '@/components/TypingComponent';
import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';
import GlobalStyles from '@/styles/styles';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';
import { normalize } from 'react-native-elements';
import { ExternalLink } from '@/components/ExternalLink';

const Register: React.FC = () => {
  const { signIn } = useSession();
  const [userType, setUserType] = useState<'professional' | 'consumer' | null>('consumer');
  const [license, setLicense] = useState<string>('');  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLicenseValid, setLicenseValid] = useState<boolean>(true);
  const [isUserNameValid, setUsernameValid] = useState<boolean>(true);
  const [isPasswordValid, setPasswordValid] = useState<boolean>(true);
  const [isPhoneValid, setPhoneValid] = useState<boolean>(true);
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const [isZipValid, setZipValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProfessional, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validateUserName = (): boolean => {
    if (username.length > 0) {
      setUsernameValid(true);
      return true;
    } else {
      setUsernameValid(false);
      return false;
    }
  }

  const validateLicense = (): boolean => {
    if (!isProfessional){
      setLicenseValid(true);
      return true;
    }
    if (license.length > 0) {
      setLicenseValid(true);
      return true;
    } else {
      setLicenseValid(false);
      return false;
    }
  }


  const validatePassword = (): boolean => {
    if (password.length > 5) {
      setPasswordValid(true);
      return true;
    } else {
      setPasswordValid(false);
      return false;
    }
  }

  const validatePhone = (): boolean => {
    const phoneRegex = /^\+1 \(\d{3}\) \d{3}-\d{4}$/; // US phone number format: +1 (123) 456-7890
    if (phoneRegex.test(phone)) {
      setPhoneValid(true);
      return true;
    } else {
      setPhoneValid(false);
      return false;
    }
  }

  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailValid(true);
      return true;
    } else {
      setEmailValid(false);
      return false;
    }
  };

  const validateZip = (): boolean => {
    if (zipcode.length == 5) {
      setZipValid(true);
      return true;
    } else {
      setZipValid(false);
      return false;
    }
  }

  const handleValidation = (): boolean => {
    const validationErrors: string[] = [];

    if (!validateUserName()) validationErrors.push('Invalid username');
    if (!validateEmail()) validationErrors.push('Invalid email');
    if (!validatePassword()) validationErrors.push('Invalid password');
    if (!validatePhone()) validationErrors.push('Invalid phone number');
    if (!validateZip()) validationErrors.push('Invalid Zip code');
    if (!validateLicense()) validationErrors.push('Invalid License');

    setErrors(validationErrors);

    // Return true if there are no validation errors
    return validationErrors.length === 0;
  };


  const handleRegister = async () => {
    const isValid = handleValidation();
    if (isValid) {
      try {
        const response = await fetch(BASE_URL + '/api/Auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userType: (isProfessional) ? 'professional' : 'user',
            Username: username,
            Email: email,
            Password: password,
            ZipCode: zipcode,
            PhoneNumber: phone,
            LicenseNumber: license
          }),
        });

        const data = await response.json();
        if (response.ok) {
          await signIn(data.token, JSON.stringify(data.userId), data.userType);
          router.replace('/');
        } else {
          Alert.alert('Error', data.message || 'Registration failed');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while registering. Please try again.');
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "rgba(0, 0, 0, 0.1)",}} automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.signUpButton} onPress={() => { router.replace('/auth/login'); }}>
            <Text style={styles.signUpText}>
              <FontAwesome name="arrow-left" /> login
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(20) }}>
            <Switch
              trackColor={{ false: "#C0C0C0", true: "#C0C0C0" }}
              thumbColor={isProfessional ? "#B87333" : "#000"}
              ios_backgroundColor="#C0C0C0"
              onValueChange={toggleSwitch}
              value={isProfessional}
            />
            <Text>
              <Text style={{ fontWeight: 'bold', fontSize:normalize(12), color: '#000' }}>{isProfessional ? ' I am a professional.' : ' I am not a professional.'}</Text>
              <Text style={{ fontWeight: 'bold', fontSize:normalize(12), color: 'red' }}>{isProfessional && `${'\n'} Your phone number will be displayed.`}</Text>
            </Text>
          </View>
          {isProfessional && 
          <>
          <Text style={styles.label}>License Number:</Text>
          <TextInput
            value={license}
            onChangeText={setLicense}
            placeholderTextColor="#000"
            style={[styles.input]}
             onBlur={validateLicense}
          />
            {!isLicenseValid &&
            (<Text style={{ color: 'red' }}>license is required</Text>)}
          </>
          }


          <Text style={styles.label}>Display Name:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#000"
            style={[styles.input, !isUserNameValid && styles.inputError]}
            onBlur={validateUserName}
          />
          {!isUserNameValid &&
            (<Text style={{ color: 'red' }}>display name is required</Text>)}
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#000"
            secureTextEntry
            onBlur={validatePassword}
            style={[styles.input, !isPasswordValid && styles.inputError]}
          />
          {!isPasswordValid &&
            (<Text style={{ color: 'red' }}>password is required and must be {'>'} 5 charchters </Text>)}

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
          <TextInputMask
            type={'custom'}
            options={{
              mask: '+1 (999) 999-9999',
            }}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#000"
            returnKeyType="done"
            onBlur={validatePhone}
            style={[styles.input, !isPhoneValid && styles.inputError]}
          />
          {!isPhoneValid &&
            (<Text style={{ color: 'red' }}>proper phone number is required.</Text>)}

          <Text style={styles.label}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#000"
            onBlur={validateEmail}
            style={[styles.input, !isEmailValid && styles.inputError]}
            autoCapitalize="none"
            autoCorrect={false}

          />
          {!isEmailValid &&
            (<Text style={{ color: 'red' }}>proper email is required.</Text>)}

          <Text style={styles.label}>Zip code:</Text>
          <TextInput
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="number-pad"
            placeholderTextColor="#000"
            onBlur={validateZip}
            style={[styles.input, !isZipValid && styles.inputError]}
          />
          {!isZipValid &&
            (<Text style={{ color: 'red' }}>Proper zip is required.</Text>)}

          <View style={{ marginVertical: 10 }}>
            <Text>by tapping 'register', you confirm that you have read and agree to our <ExternalLink style={{ color: '#007bff', textDecorationLine: 'underline' }} href={'https://app.termly.io/policy-viewer/policy.html?policyUUID=92b8a492-eea6-4e68-9727-7430bc07dac5'}>privacy policy</ExternalLink> and <ExternalLink href={'https://app.termly.io/policy-viewer/policy.html?policyUUID=e7fd608a-64a0-4e12-91b9-e154a15eb707'} style={{ color: '#007bff', textDecorationLine: 'underline' }} >terms and conditions</ExternalLink>.</Text>
          </View>
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>register</Text>
          </TouchableOpacity>
        </View>
        {/* </ImageBackground> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    resizeMode: 'cover',
    height: 200,
    width: null,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 20,
    justifyContent: 'space-evenly',
  },
  container: {
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
    color: '#000',//'#B87333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '200'

  },
  input: {
    height: 50,
    borderColor: '#B87333',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'rgba(111, 111, 111, .1)', // Darker background for inputs
    borderRadius: 5
  },
  inputError: {
    borderColor: 'red',
    // color: 'red'
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
    borderWidth: 2,
    borderColor: '#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
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
  header: {
    width: normalize(100),
    //    position: "absolute",
    //    left: 0,
    margin: 20
    //    right:10,
    //    position:"absolute",


    //    flexDirection: 'row',
    //  marginBottom: 20,
  },
});

export default Register;
